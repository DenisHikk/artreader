export default {
    activate(ctx) {
        ctx.checkWork(calculate());
    }
} 

function calculate() {
    return 1+2;
}