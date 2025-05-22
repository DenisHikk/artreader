// class for generating uid's
export class UidGenerator {
    generatedIds:Set<number> = new Set([1]);

    // Generate new uid
    getUid(): number {
        if (this.generatedIds.size > 100000)
        {
            throw new Error("You're trying to open more than 100.000 tabs. " +
              " Are you sick? I can't give you another id. The pool is full.");
        }
        let newId:number;
        do {
            newId = Math.floor(Math.random() * 100000) + 1;
        } while (this.generatedIds.has(newId));
        this.generatedIds.add(newId);
        return newId;
    }

    // Remove id
    removeId(id:number) {
        if (!this.generatedIds.has(id)) {
            throw new Error("The tab ID you are trying to remove from the " +
                "pool does not exist in this pool");
        }
        this.generatedIds.delete(id);
    }
}