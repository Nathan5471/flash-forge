export default function CalcAmountPerType(questionTypes, questionCount) {
    const amountPerType = {};

    const average = Math.floor(questionCount / questionTypes.length);
    const remainder = questionCount % questionTypes.length;

    let total = 0;
    questionTypes.forEach((type, index) => {
        amountPerType[type] = [total, average + (index < remainder ? 1 : 0)]; // Format: [startIndex, amount]
        total += amountPerType[type][1];
    })

    return amountPerType;
}