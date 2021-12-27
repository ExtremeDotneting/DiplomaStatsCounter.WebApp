function calc(x1, x2, alpha){
	var sqrt=Math.sqrt;
    var abs=Math.abs;
	
	var Z=abs(0.479-alpha*x1-0.004*x2);
	var Avarage_Effort = 7.11403125; // Средний Effort
	var student =2.35183518; // Коеф. Стьюдента
	var SZY = 0.120810582 // сумма квадратов разностей y
	var SZX1= 0.4378559 // сумма квадратов разницы x1 ????
	var SZX2= 10.55299655 // сумма квадратов разницы x1 ????

    var b0	= 1.6653;
    var b1	= 0.5552;
    var b2	= 0.0336;

    var predictet_Y= b0+x1*b1+x2*b2;
	
	var trustInterval_Left=Avarage_Effort-student*SZY*sqrt(1/32+Z/SZX1);//доверительный лев. гр.
	var trustInterval_Right=Avarage_Effort+student*SZY*sqrt(1/32+Z/SZX1);//доверительный прав. гр.
	var predictedInterval_Left=Avarage_Effort-student*SZY*sqrt(1+1/32+Z/SZX1);//предсказательный лев. гр.
	var predictedInterval_Right=Avarage_Effort+student*SZY*sqrt(1+1/32+Z/SZX1);//предсказательный прав. гр.


	console.log("Вы ввели x1 = "+x1);
	console.log("Вы ввели x2 = "+x2);
	console.log("Предсказанное значение:");
	console.log("ŷ = b0 + b1*x1 + b2*x2 + ε ");
	console.log("ŷ = "+b0+" + "+b1+"*"+x1+" + "+b2+"*"+x2+" + ε ");
	console.log("ŷ = "+predictet_Y+" + ε ");
	console.log("Левая граница доверительного интервала = "+trustInterval_Left);
	console.log("Правая граница доверительного интервала = "+trustInterval_Right);
	console.log("Левая граница предсказательного интервала = "+predictedInterval_Left);
	console.log("Правая граница предсказательного интервала интервала = "+predictedInterval_Right);
	
	var allData={Z, Avarage_Effort,student,SZY,SZX1,SZX2};
    allData["1/32+Z/SZX1"]=1/32+Z/SZX1;
	allData["sqrt(1/32+Z/SZX1)"]=sqrt(1/32+Z/SZX1);
	console.log(allData);

}

calc(100, 200)