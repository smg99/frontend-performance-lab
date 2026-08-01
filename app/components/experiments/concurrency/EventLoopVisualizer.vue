<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Event Loop Architecture</h4>
        <p class="text-xs text-text-secondary">A live visualization of the JavaScript Event Loop, Call Stack, and Browser Web APIs.</p>
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 bg-text-primary text-background border border-text-primary rounded text-sm hover:bg-text-secondary transition-colors font-bold" @click="trigger('sync')">Sync Fn</button>
        <button class="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-sm hover:bg-purple-500/20 transition-colors" @click="trigger('promise')">Promise</button>
        <button class="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded text-sm hover:bg-blue-500/20 transition-colors" @click="trigger('timeout')">setTimeout</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
      
      <!-- Call Stack -->
      <div class="bg-surface border border-border rounded-lg p-4 flex flex-col">
        <h5 class="text-sm font-bold text-text-primary mb-3 text-center border-b border-border pb-2">Call Stack</h5>
        <div class="flex-1 flex flex-col justify-end gap-2 min-h-[200px]">
          <transition-group name="stack">
            <div 
              v-for="item in callStack" 
              :key="item.id"
              class="bg-background border border-border text-text-primary text-xs font-mono p-3 rounded text-center shadow-lg"
            >
              {{ item.name }}
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Web APIs -->
      <div class="bg-surface border border-border rounded-lg p-4 flex flex-col relative">
        <h5 class="text-sm font-bold text-text-primary mb-3 text-center border-b border-border pb-2">Web APIs (Browser)</h5>
        <div class="flex-1 flex flex-wrap content-start gap-2 min-h-[200px]">
          <transition-group name="fade">
            <div 
              v-for="api in webApis" 
              :key="api.id"
              class="bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs font-mono p-2 rounded text-center w-full shadow-lg"
            >
              {{ api.name }} (Timer)
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Queues -->
      <div class="flex flex-col gap-4">
        <!-- Microtasks -->
        <div class="bg-surface border border-border rounded-lg p-4 flex flex-col flex-1">
          <h5 class="text-sm font-bold text-purple-400 mb-3 text-center border-b border-border pb-2">Microtasks</h5>
          <div class="flex-1 flex flex-col gap-2">
            <transition-group name="queue-right">
              <div 
                v-for="task in microtasks" 
                :key="task.id"
                class="bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-mono p-2 rounded shadow-lg"
              >
                {{ task.name }}
              </div>
            </transition-group>
          </div>
        </div>

        <!-- Macrotasks -->
        <div class="bg-surface border border-border rounded-lg p-4 flex flex-col flex-1">
          <h5 class="text-sm font-bold text-blue-400 mb-3 text-center border-b border-border pb-2">Macrotasks</h5>
          <div class="flex-1 flex flex-col gap-2">
            <transition-group name="queue-right">
              <div 
                v-for="task in macrotasks" 
                :key="task.id"
                class="bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs font-mono p-2 rounded shadow-lg"
              >
                {{ task.name }}
              </div>
            </transition-group>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const callStack = ref<{id: number, name: string}[]>([])
const webApis = ref<{id: number, name: string}[]>([])
const microtasks = ref<{id: number, name: string}[]>([])
const macrotasks = ref<{id: number, name: string}[]>([])

let idCounter = 1
let isProcessing = false

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const processEventLoop = async () => {
  if (isProcessing) return
  isProcessing = true

  while (microtasks.value.length > 0 || macrotasks.value.length > 0) {
    // Process ALL microtasks first
    while (microtasks.value.length > 0) {
      const task = microtasks.value.shift()!
      callStack.value.push(task)
      await sleep(800)
      callStack.value.pop()
      await sleep(200)
    }

    // Process ONE macrotask
    if (macrotasks.value.length > 0) {
      const task = macrotasks.value.shift()!
      callStack.value.push(task)
      await sleep(800)
      callStack.value.pop()
      await sleep(200)
    }
  }

  isProcessing = false
}

const trigger = async (type: 'sync' | 'promise' | 'timeout') => {
  const id = idCounter++
  
  if (type === 'sync') {
    callStack.value.push({ id, name: `console.log(${id})` })
    await sleep(600)
    callStack.value.pop()
  } else if (type === 'promise') {
    callStack.value.push({ id, name: `Promise.resolve(${id})` })
    await sleep(400)
    callStack.value.pop()
    microtasks.value.push({ id, name: `then(cb #${id})` })
    processEventLoop()
  } else if (type === 'timeout') {
    callStack.value.push({ id, name: `setTimeout(${id})` })
    await sleep(400)
    callStack.value.pop()
    webApis.value.push({ id, name: `Timer #${id}` })
    
    // Simulate browser timer delay, then push to macrotask queue
    setTimeout(() => {
      webApis.value = webApis.value.filter(a => a.id !== id)
      macrotasks.value.push({ id, name: `timeout cb #${id}` })
      processEventLoop()
    }, 1000)
  }
}
</script>

<style scoped>
.stack-enter-active,
.stack-leave-active,
.fade-enter-active,
.fade-leave-active,
.queue-right-enter-active,
.queue-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stack-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.stack-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.queue-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.queue-right-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
