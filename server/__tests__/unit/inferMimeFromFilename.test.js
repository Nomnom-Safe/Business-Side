'use strict';

const { inferMimeFromFilename } = require('../../src/utils/inferMimeFromFilename');

describe('inferMimeFromFilename', () => {
  test('maps .pdf', () => {
    expect(inferMimeFromFilename('Menu.PDF')).toBe('application/pdf');
  });
  test('maps .docx', () => {
    expect(inferMimeFromFilename('x.docx')).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });
  test('maps .csv', () => {
    expect(inferMimeFromFilename('data.CSV')).toBe('text/csv');
  });
  test('returns null for unknown', () => {
    expect(inferMimeFromFilename('x.png')).toBeNull();
    expect(inferMimeFromFilename('')).toBeNull();
  });
});
