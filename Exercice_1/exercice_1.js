function sumBetween(num1, num2) {
    const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= num1 && arr[i] <= num2) {
            sum += arr[i];
        }
    }
    return sum;
}


const result = sumBetween(12, 22);
console.log(result);