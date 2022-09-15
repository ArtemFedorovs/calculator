
let inputString = "";


function updateResult(buttonResultPressed = false) { 
    let outputField = document.querySelector(".calc__result");
    let inputField = document.querySelector(".calc__input");
    inputField.firstElementChild.innerHTML = inputString;
    try {  
        let result =  String( parseFloat( Number( calculate(inputString) ).toFixed(8) ) )    //Округление результата вызова функции с точность. 8 знаков после запятой
        outputField.firstElementChild.innerHTML = result;
        return result;
    } 
    catch (e) {  //блок выполняемый в случае, если пользователь сделал неверный ввод
        console.log(e.message);
        buttonResultPressed ? outputField.firstElementChild.innerHTML = "Неверное выражение": outputField.firstElementChild.innerHTML = ""; 
        return null;
    }    
};

const calculate = function (string) {
    let inputArray = Array.from(string);
    if (inputArray.length == 0) {return ""}; //на случай, если данные на входе пусты

    if (inputArray[0] =="+") {    //убираем плюс, если он стоит первым знаком
        if (isNaN(Number(inputArray[1]))) {
            throw new Error("Неверный ввод, два знака подряд в начале")
        }       
        inputArray.shift()
    }

    if (inputArray[0] =="-") {  //убираем минус, если он стоит первым знаком
        if (isNaN(Number(inputArray[1]))) {
            throw new Error("Неверный ввод, два знака подряд в начале")
        }
        inputArray[1] = 0 - inputArray[1];
        inputArray.shift();
    }

    for (let i = 0 ; i < inputArray.length; i++) {      // склеиваем числа из цифр (["1","2","3","+","3","4"] => ["123","+","34"]
        if (!isNaN(Number(inputArray[i])) && !isNaN(Number(inputArray[i+1]))) {
            inputArray[i+1] = inputArray[i] + inputArray[i+1];
            inputArray.splice(i, 1);
            i--;
        }
    }

    for (let i = 0 ; i < inputArray.length; i++) {      // склеиваем числа с точкой  (["123",".","34"] => ["123."34"]
        if (inputArray[i] == ".") {
            if (!isNaN(Number(inputArray[i-1])) && !isNaN(Number(inputArray[i+1])) && inputArray[i+2] !== ".") {
                inputArray[i-1] = inputArray[i-1] + inputArray[i]  +inputArray[i+1];
                inputArray.splice(i, 2);
            } else {
                throw new Error("Неверный ввод, двe точки подряд / отсутсвие чисел перед или после точки")
            }

        }
    }

    for (let i = 0 ; i < inputArray.length; i++) {      // переводим проценты в доли единицы
        if (inputArray[i] == "%") {
            if (!isNaN(Number(inputArray[i-1])) && isNaN(Number(inputArray[i+1]))  && inputArray[i+1] !== "." && inputArray[i+1] !== "%") {
                inputArray[i-1] = String(inputArray[i-1] / 100);
                inputArray.splice(i, 1);
            } else {
                throw new Error("Неверный ввод, неверное расположение знака %")
            }
        }
    }

    if (inputArray.length == 1) {    //если в массиве после вышеуказанных преобразований одно число, то его и возвращаем
        if (!isNaN(Number(inputArray[0]))) {
            return inputArray[0]      
        } else {
            throw new Error("Неверный ввод, введен лишь один оператор")
        }    
    }; 


    let isRoundBrackets = false;
    let openBrIndex;    
    let closeBrIndex;

    for (openBrIndex = 0 ; openBrIndex < inputArray.length; openBrIndex++) {  //ищем открывающуюся скобку
        if (inputArray[openBrIndex] == ")") throw new Error("Неверный ввод, нехватает открывающейся скобки");
        if (inputArray[openBrIndex] == "(") {
            closeBrIndex = openBrIndex;  
            for (closeBrIndex; closeBrIndex < inputArray.length; closeBrIndex++){  //если нашли, ищем закрывающуюся
                (inputArray[closeBrIndex] == "(") && (openBrIndex = closeBrIndex);  //если на пути встречаем снова открывающуюся, то назначаем её рабочей
                if (inputArray[closeBrIndex] == ")") {  // как нашли закрывающуюся выходим из цикла
                    isRoundBrackets = true; 
                    break;
                }        
            };
            if (!isRoundBrackets) { throw new Error("Неверный ввод, нехватает закрывающейся скобки") };  //если не нашли закрывающуюся , кидаем ошибку
            
            break;
        };      
    }

    if (closeBrIndex - openBrIndex == 1) {throw new Error("Неверный ввод, отсутствует выражение внутри скобок")};
                                                        
    if (isRoundBrackets) { // в случае, если блок выше нашел скобки 
        if (!isNaN(Number(inputArray[openBrIndex-1]))) {   //эти два блока if позволят пользователю вводить данные вот так: 3(2) что будет эквивалентно 3 * (2)
            inputArray.splice(openBrIndex, 0, "*"); 
            openBrIndex++
            closeBrIndex++
        }     
        if (!isNaN(Number(inputArray[closeBrIndex+1]))) {
            inputArray.splice(closeBrIndex+1, 0, "*"); 
        }
 
        inputArray.splice(openBrIndex, closeBrIndex - openBrIndex + 1, calculate ( inputArray.slice(openBrIndex + 1, closeBrIndex) )); // заменяем выражение внутри найденных внутренних скобок результатом вычисления этого выражения 
        return calculate(inputArray) // рекурсивный вызов функции на выражение с вычисленным занчением внутри внутренних скобок

    } else {  // в случае, если блок не нашел скобки

        for (let i = 0; i < inputArray.length; i++) {  //ищем первый плюс и возвращаем результат сложения выражений справа и слева от плюса
            if (inputArray[i] == "+") { 
                let sides = splitAndCulcItsParts(inputArray, i); 
                return String(Number(sides[0]) + Number(sides[1]));
            };
        };

        for (let i = 0; i < inputArray.length; i++) { //тоже самое с минусом, если символ выше не нашелся
            if (inputArray[i] == "-") { 
                let sides = splitAndCulcItsParts(inputArray, i); 
                return String(Number(sides[0]) - Number(sides[1]));
            };
        };

        for (let i = 0; i < inputArray.length; i++) { //тоже самое с умножением, если символы выше не нашлись
            if (inputArray[i] == "*") { 
                let sides = splitAndCulcItsParts(inputArray, i); 
                return String(Number(sides[0]) * Number(sides[1]));
            };
        };

        for (let i = 0; i < inputArray.length; i++) { //тоже самое с делением, если символы выше не нашлись
            if (inputArray[i] == "/") { 
                let sides = splitAndCulcItsParts(inputArray, i);
                if (sides[1] == "0") {throw new Error("Деление на ноль")}; 
                return String(Number(sides[0]) / Number(sides[1]));
            };
        };

        for (let i = 0; i < inputArray.length; i++) { //тоже самое со степенью, если символы выше не нашлись
            if (inputArray[i] == "^") { 
                let sides = splitAndCulcItsParts(inputArray, i); 
                return String(Math.pow(Number(sides[0]) ,  Number(sides[1])));
            };
        };
    }

    function splitAndCulcItsParts (arr, i) {     //разделяем выражение на две его стороны и вычисляем значение сторон, 
        let leftSide = arr.slice(0, i);
        let rightSide = arr.slice(i+1);
        leftSide = checkAndFormatSide(leftSide);  //проверяем валидность части выражения и делаем из массива число, если массив состоит только из одного числа
        rightSide = checkAndFormatSide(rightSide);         
        Array.isArray(leftSide) && (leftSide = calculate(leftSide));
        Array.isArray(rightSide) && (rightSide = calculate(rightSide));
        return [leftSide, rightSide]
    }

    function checkAndFormatSide (side) {     //проверяем валидность части выражения и делаем из массива число, если массив состоит только из одного числа
        if (side.length == 0) {throw new Error("Неверный ввод, оператор первым или последним знаком")};
        if (side.length == 1) {
            if (isNaN(Number(side[0]))) {throw new Error("Неверный ввод, два оператора подряд")};
            side = side[0];
            if (side > Number.MAX_SAFE_INTEGER)  {throw new Error("Слишком большое число")};
        }
        return side
    }   
}

window.addEventListener('keydown', function(event){   //функция ввода с клавиатуры
    if (event.repeat == true && event.key !=="Backspace" && event.key !=="Delete") { return; };
    console.log(String(event.key));
    pressButton(String(event.key));
});

function pressButton(key) {   //обработчик события нажатие клавиш
    if (key == "DEL" || key == "Backspace"  || key == "Delete") {
        inputString = inputString.substring(0, inputString.length - 1);
        updateResult(); 
    };
    if (key == "AC") {
        inputString = "";
        updateResult(); 
    };
    if (key == "=") {
        let inputField = document.querySelector(".calc__input");
        inputString = updateResult(true) || inputString;
        inputField.firstElementChild.innerHTML = inputString
    };
    if ((!isNaN(Number(key)) && key!==" ") || key == "+"|| key == "-"|| key == "*"|| key == "/" || key == "^"|| key == "." || key == "%" || key == "(" || key == ")") {
        inputString = inputString + key; 
        updateResult(); 
    };
};


//module.exports =  {calculate};