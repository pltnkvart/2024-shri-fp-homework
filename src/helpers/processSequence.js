/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
	__,
	allPass,
	andThen,
	assoc,
	compose,
	gt,
	ifElse,
	lt,
	partial,
	prop,
	tap,
	test,
	length,
	otherwise,
} from 'ramda';

const api = new Api();

const BASE_ANIMAL_URL = 'https://animals.tech';
const GET_NUMBERS_BASE = 'https://api.tech/numbers/base';
const NUMBER_PARAMS = { from: 10, to: 2 };

const getResult = compose(String, prop('result'));

const getBinaryNumber = compose(
	api.get(GET_NUMBERS_BASE),
	assoc('number', __, NUMBER_PARAMS)
);
const getAnimal = (id) => api.get(`${BASE_ANIMAL_URL}/${id}`, {});

const roundStringToNumber = compose(Math.round, Number);

const isLengthLowerThenTen = compose(lt(__, 10), length);
const isLengthsMoreThenTwo = compose(gt(__, 2), length);
const isSymbolsCorrect = test(/^\d+\.?\d*$/);

const isValueValid = allPass([
	isLengthsMoreThenTwo,
	isLengthLowerThenTen,
	isSymbolsCorrect,
]);

const square = (n) => Math.pow(n, 2);
const modThree = (n) => n % 3;

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
	const tapLog = tap(writeLog);

	const sequence = compose(
		otherwise(handleError),
		andThen(handleSuccess),
		andThen(getResult),
		andThen(getAnimal),
		andThen(tapLog),
		andThen(modThree),
		andThen(tapLog),
		andThen(square),
		andThen(tapLog),
		andThen(length),
		andThen(tapLog),
		andThen(getResult),
		getBinaryNumber,
		tapLog,
		roundStringToNumber
	);

	const runSequence = ifElse(
		isValueValid,
		sequence,
		partial(handleError, ['ValidationError'])
	);
	const runBeforeCheck = compose(runSequence, tapLog);

	runBeforeCheck(value);
};

export default processSequence;
