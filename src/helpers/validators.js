/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
	__,
	prop,
	equals,
	compose,
	allPass,
	countBy,
	identity,
	values,
	gte,
	anyPass,
	propEq,
	complement,
} from 'ramda';

// Getters
const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');

// Color getters
const getGreen = prop('green');
const getRed = prop('red');
const getOrange = prop('orange');
const getBlue = prop('blue');
// const getWhite = prop('white');

// Color validators
const isWhite = equals('white');
const isRed = equals('red');
const isOrange = equals('orange');
const isGreen = equals('green');
const isBlue = equals('blue');

// Star Color Validators
const isRedStar = compose(isRed, getStar);
const isGreenStar = compose(isGreen, getStar);
const isOrangeStar = compose(isOrange, getStar);
const isBlueStar = compose(isBlue, getStar);

// Square Color Validators
const isGreenSquare = compose(isGreen, getSquare);
const isOrangeSquare = compose(isOrange, getSquare);
const isWhiteSquare = compose(isWhite, getSquare);

// Circle Color Validators
const isWhiteCircle = compose(isWhite, getCircle);
const isBlueCircle = compose(isBlue, getCircle);

// Triangle Color Validators
const isWhiteTriangle = compose(isWhite, getTriangle);
const isGreenTriangle = compose(isGreen, getTriangle);

// Helpers
const countColors = compose(countBy(identity), values);
const isBlueAndRedEquals = ({ blue, red }) => equals(blue, red);
const isAllColorsTheSame = (color) => compose(propEq(color, 4), countColors);
const isTriangleAndSquareSameColor = ({ square, triangle }) =>
	equals(square, triangle);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
	isRedStar,
	isGreenSquare,
	isWhiteCircle,
	isWhiteTriangle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(gte(__, 2), getGreen, countColors);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = allPass([
	compose(isBlueAndRedEquals, countColors),
]);

// 4. Синий круг, красная звезда, оранжевый квадрат, треугольник любого цвета
export const validateFieldN4 = allPass([
	isBlueCircle,
	isRedStar,
	isOrangeSquare,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
	compose(gte(__, 3), getGreen, countColors),
	compose(gte(__, 3), getRed, countColors),
	compose(gte(__, 3), getBlue, countColors),
	compose(gte(__, 3), getOrange, countColors),
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
	compose(propEq('green', 2), countColors),
	isGreenTriangle,
	compose(propEq('red', 1), countColors),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = isAllColorsTheSame('orange');

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = anyPass([isGreenStar, isOrangeStar, isBlueStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = isAllColorsTheSame('green');

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
	isTriangleAndSquareSameColor,
	complement(isWhiteTriangle),
	complement(isWhiteSquare),
]);
