export default function CalcAmountPerType(questionTypes, questionCount) {
    const amountPerType = [];
    const sortOrder = ["multipleChoice", "written", "trueFalse", "matching"];

    for (let i = 0; i < questionCount; i++) {
        const typeIndex = i % questionTypes.length;
        amountPerType.push(questionTypes[typeIndex]);
    }

    const sortedAmountPerType = amountPerType.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
    return sortedAmountPerType;
}