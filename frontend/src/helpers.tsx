
export function deleteElement(arr: string[], index: number) {
    const newArr = [...arr];
    newArr.splice(index, 1);
    return newArr;
}

export function reorderElements(arr: string[], index: number, direction: 'up' | 'down') {
    const newArr = [...arr];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // check out of bounds
    if (targetIndex < 0 || targetIndex >= arr.length) return arr;

    // swap elements
    const temp = newArr[index]
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    return newArr;
};
