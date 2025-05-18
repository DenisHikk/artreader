
// It scares me and I don't know how it works.
export function throttle<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let isThrottled = false;
    let savedArgs: Parameters<T> | null = null;
    let savedContext: any = null;

    function wrapper(this: any, ...args: Parameters<T>) {
        if(isThrottled) {
            savedArgs = args;
            savedContext = this;
            return;
        }

        func.apply(this, args);

        isThrottled = true;
        
        setTimeout(() => {
            isThrottled = false;
            if(savedArgs) {
                wrapper.apply(savedContext, savedArgs);
                savedArgs = null;
                savedContext = null;
            }
        }, delay)
    }
    return wrapper;
}