//npm init
//npm install --save-dev jest
const {calculate} = require("./script.js");

 // работа с числеми без операторов
test("", () => {expect(calculate("")).toBe("")});
test("1", () => {expect(calculate("1")).toBe("1")});
test("11", () => {expect(calculate("11")).toBe("11")});
test("111", () => {expect(calculate("111")).toBe("111")});
test("1.3", () => {expect(calculate("1.3")).toBe("1.3")});
test("1.345", () => {expect(calculate("1.345")).toBe("1.345")});
test("53%", () => {expect(calculate("53%")).toBe("0.53")});

 // операции с многозначными числами
test("1+3", () => {expect(calculate("1+3")).toBe("4")});
test("11+3", () => {expect(calculate("11+3")).toBe("14")});
test("111+22", () => {expect(calculate("111+22")).toBe("133")});
test("123456789*2", () => {expect(calculate("123456789*2")).toBe("246913578")});
test("1234567890123456*1", () => {expect(calculate("1234567890123456*1")).toBe("1234567890123456")});


 // базовые операции
test("11-3", () => {expect(calculate("11-3")).toBe("8")});
test("33/11", () => {expect(calculate("11+33")).toBe("44")});
test("2/0.1", () => {expect(calculate("2/0.1")).toBe("20")});
test("2*3", () => {expect(calculate("2*3")).toBe("6")});
test("2^3", () => {expect(calculate("2^3")).toBe("8")});

//комбинации операций
test("1+2-3/1*2+3^2", () => {expect(calculate("1+2-3/1*2+3^2")).toBe("6")});
test("2*100%", () => {expect(calculate("2*100%")).toBe("2")});
test("-1+2", () => {expect(calculate("-1+2")).toBe("1")});

//деление на 0
test("2+4+8/0", () => {expect(() => calculate("2+4+8/0")).toThrow()});


// несовсем правильные вводы, которые всё равно должны работать
test("+1", () => {expect(calculate("+1")).toBe("1")});
test("2(3)4", () => {expect(calculate("2(3)4")).toBe("24")});
test("2(((3)))(4)", () => {expect(calculate("2(((3)))(4)")).toBe("24")});

// неверные вводы

test("+", () => {expect(() => calculate("+")).toThrow()});
test("-", () => {expect(() => calculate("-")).toThrow()});
test("*", () => {expect(() => calculate("*")).toThrow()});
test("/", () => {expect(() => calculate("/")).toThrow()});
test("^", () => {expect(() => calculate("^")).toThrow()});
test("^+", () => {expect(() => calculate("^+")).toThrow()});
test("+-*", () => {expect(() => calculate("+-*")).toThrow()});
test("/3", () => {expect(() => calculate("/3")).toThrow()});
test("*3", () => {expect(() => calculate("*3")).toThrow()});
test("^3", () => {expect(() => calculate("^3")).toThrow()});
test(".3", () => {expect(() => calculate(".3")).toThrow()});
test("%3", () => {expect(() => calculate("%3")).toThrow()});
test("3..", () => {expect(() => calculate("3..")).toThrow()});
test("3%%", () => {expect(() => calculate("3%%")).toThrow()});
test("3%3", () => {expect(() => calculate("3%3")).toThrow()});
test("3%3%3", () => {expect(() => calculate("3%3%3")).toThrow()});
test("3.3.3", () => {expect(() => calculate("3.3.3")).toThrow()});


test(")", () => {expect(() => calculate(")")).toThrow()});
test("(", () => {expect(() => calculate("(")).toThrow()});
test("((2)", () => {expect(() => calculate("((2)")).toThrow()});
test("9)", () => {expect(() => calculate("9)")).toThrow()});
test("1+2*(10/5)+2)", () => {expect(() => calculate("1+2*(10/5)+2)")).toThrow()});


// ввод слишком больших чисел

test("слишком большие числа", () => {expect(() => calculate("12345678901234567*1")).toThrow()});
