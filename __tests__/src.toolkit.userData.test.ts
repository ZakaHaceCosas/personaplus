import { validateBasicData, validateBasicHealthData } from '@/src/toolkit/userData';

describe('validateBasicData', () => {
    // valid data
    test('should return true for valid data', () => {
        expect(validateBasicData('male', 25, 70, 175, 'username')).toBe(true);
        expect(validateBasicData('female', '30', '60', '160', 'username')).toBe(true);
    });

    // null gender; invalid gender
    test('should return false for invalid gender', () => {
        expect(validateBasicData(null, 25, 70, 175, 'username')).toBe(false);
        expect(validateBasicData('transformer', 25, 70, 175, 'username')).toBe(false);
    });

    // null age; under age (4); over age (100)
    test('should return false for invalid age', () => {
        expect(validateBasicData('male', null, 70, 175, 'username')).toBe(false);
        expect(validateBasicData('male', '4', 70, 175, 'username')).toBe(false);
        expect(validateBasicData('male', '100', 70, 175, 'username')).toBe(false);
    });

    // null weight; underweight (14); overweight (301)
    // it's kilograms, btw
    test('should return false for invalid weight', () => {
        expect(validateBasicData('male', 25, null, 175, 'username')).toBe(false);
        expect(validateBasicData('male', 25, '14', 175, 'username')).toBe(false);
        expect(validateBasicData('male', 25, '301', 175, 'username')).toBe(false);
    });

    // null height, under height (44), over height (261)
    // it's centimeres, btw
    test('should return false for invalid height', () => {
        expect(validateBasicData('male', 25, 70, null, 'username')).toBe(false);
        expect(validateBasicData('male', 25, 70, '44', 'username')).toBe(false);
        expect(validateBasicData('male', 25, 70, '261', 'username')).toBe(false);
    });

    // null username; empty username, too short username, too long username
    test('should return false for invalid username', () => {
        expect(validateBasicData('male', 25, 70, 175, null)).toBe(false);
        expect(validateBasicData('male', 25, 70, 175, '')).toBe(false);
        expect(validateBasicData('male', 25, 70, 175, 'a')).toBe(false);
        expect(validateBasicData('male', 25, 70, 175, 'a'.repeat(41))).toBe(false);
    });
});

describe('validateBasicHealthData', () => {
    // valid data
    test('should return true for valid health data', () => {
        expect(validateBasicHealthData('male', 25, 70, 175)).toBe(true);
        expect(validateBasicHealthData('female', '30', '60', '160')).toBe(true);
    });

    // null gender; invalid gender
    test('should return false for invalid gender', () => {
        expect(validateBasicHealthData(null, 25, 70, 175)).toBe(false);
        expect(validateBasicHealthData('dorito', 25, 70, 175)).toBe(false);
    });

    // null age; under age (4); over age (100)
    test('should return false for invalid age', () => {
        expect(validateBasicHealthData(null, '4', 70, 175)).toBe(false);
        expect(validateBasicHealthData(null, '100', 70, 175)).toBe(false);
    });

    // null weight; underweight (14); overweight (301)
    test('should return false for invalid weight', () => {
        expect(validateBasicHealthData(null, 25, '14', 175)).toBe(false);
        expect(validateBasicHealthData(null, 25, '301', 175)).toBe(false);
    });

    // null height, under height (44), over height (261)
    test('should return false for invalid height', () => {
        expect(validateBasicHealthData(null, 25, 70, '44')).toBe(false);
        expect(validateBasicHealthData(null, 25, 70, '261')).toBe(false);
    });
});
