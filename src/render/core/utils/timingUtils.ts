
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

export type DebouncedFunction<T extends (...args: Parameters<T>) => void> = ((this: ThisParameterType<T>) => void) & { cancel: () => void};
export function debounce<T extends (...args: Parameters<T>) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null;
    const debounce =  function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => func.apply(this, args) , delay)
    };

    (debounce as DebouncedFunction<T>).cancel = () => {
        if(timer) {
            clearTimeout(timer);
            timer = null;
        }
    }
    return debounce as DebouncedFunction<T>;
}