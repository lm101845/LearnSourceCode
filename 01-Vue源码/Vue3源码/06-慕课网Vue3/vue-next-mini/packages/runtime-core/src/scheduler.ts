/**
 * @Author liming
 * @Date 2023/7/7 15:40
 **/

//实现调度队列
let isFlushPending = false

const resolvedPromise = Promise.resolve() as Promise<any>

let currentFlushPromise:Promise<void> | null = null

const pendingPreFlushCbs:Function[] = []

export function queuePreFlushCb(cb:Function){
  queueCb(cb,pendingPreFlushCbs)
}

function queueCb(cb:Function,pendingQueue:Function[]){
  pendingQueue.push(cb)
  queueFlush()
}

function queueFlush(){
  if(!isFlushPending){
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

function flushJobs(){
  isFlushPending = false
}

export function flushPreFlushCbs(){
  if(pendingPreFlushCbs.length){
    let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    pendingPreFlushCbs.length = 0
    for (let i = 0; i < activePreFlushCbs.length; i++) {
      activePreFlushCbs[i]()
    }
  }
}
