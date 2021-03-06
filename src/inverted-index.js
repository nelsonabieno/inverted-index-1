/**
 * Inverted Index Class
 * @class
 */
class InvertedIndex {
  /**
   * class constructor
   * For Data Initialization
   * @constructor
   */
  constructor() {
    this.allFiles = {};
    this.indexedFiles = {};
  }
  /**
   * validate
   * @param {Object} json
   * @return{Boolean}
   */
  validate(json) {
    for (let item of json) {
      if (!item.title && !item.text) {
        return false;
      }
    }
    return true;
  }
  /**
   * populateIndex
   * @param {string} fileName
   * @param {Object} fileContent
   * @return null
   */
  populateIndex(fileName, fileContent) {
    let uniqueWords = [];
    let objTitle = '';
    let objText = '';
    let objTitleText;
    fileContent.forEach((obj) => {
      if (obj.title && obj.text) {
        objTitle = this.removeSpecialXters(obj.title);
        objText = this.removeSpecialXters(obj.text);
        objTitleText = `${objTitle},${objText}`;
        uniqueWords.push(this.removeDuplicateWords(objTitle, objText));
      }
    });
    uniqueWords.forEach((singlePage, position) => {
      this.arrangeIndex(singlePage, position);
    });
  }
  /**
   * createIndex
   * @param {string}  fileName
   * @param {object}  fileContent
   * @return {object} this.allFiles[fileName]
   */
  createIndex(fileName, fileContents) {
    const validateJson = this.validate(fileContents);
    if (validateJson) {
      this.populateIndex(fileName, fileContents);
    } else {
      return false;
    }
    this.allFiles[fileName] = this.indexedFiles;
    this.indexedFiles = {};
    return this.allFiles[fileName];
  }
  /**
   * getIndex
   * @param   {string} fileName
   * @returns {Object} allFiles
   */
  getIndex(fileName) {
    return this.allFiles[fileName];
  }
  /**
   * getIndex
   * @param   {Object} obj
   * @returns {Object}
   */
  removeSpecialXters(obj) {
    return obj.toLowerCase().match(/\w+/g);
  }
  /**
   * removeDuplicateWords
   * @param   {Object} objTitle
   * @param   {Object} objText
   * @returns {Object} An array of unique words
   */
  removeDuplicateWords(objTitle, objText) {
    return [...new Set([...objTitle, ...objText])];
  }
  /**
   * arrangeIndex
   * @param {Object} singlePage
   * @param {number} position
   * @return null
   */
  arrangeIndex(singlePage, position) {
    singlePage.forEach((word) => {
      if (this.indexedFiles[word]) {
        if (!this.indexedFiles[word][position]) {
          this.indexedFiles[word][position] = true;
        }
      } else {
        let oneIndex = {};
        oneIndex[position] = true;
        this.indexedFiles[word] = oneIndex;
      }
    });
  }
  /**
   * searchIndex
   * @param   {String} input
   * @param   {String} fileName
   * @returns {Object}  searchResult returns searchResult
   */
  searchIndex(input, fileName) {
    let searchResult = {};
    let allSearchResult = {};
    let query = this.removeSpecialXters(input);
    let uniqueQuery = this.removeDuplicateWords(query, []);
    if (fileName === 'all') {
      for (let key in this.allFiles) {
        let searchResultKey = {};
        let searchSingleJson = this.allFiles[key];
        uniqueQuery.forEach((eachQuery) => {
          if (eachQuery in searchSingleJson) {
            searchResultKey[eachQuery] =
              searchSingleJson[eachQuery];
          } else {
            searchResultKey[eachQuery] = {
              0: false
            };
          }
        });
        searchResult[key] = searchResultKey;
      }
      return searchResult;
    } else {
      uniqueQuery.forEach((word) => {
        if (typeof this.allFiles[fileName] !== 'undefined' && this
          .allFiles[fileName][word]) {
          searchResult[word] = this.allFiles[fileName][word];
        } else {
          searchResult[word] = {
            0: false
          };
        }
      });
    }
    return searchResult;
  }
  /**
   * isJsonEmpty
   * @param   {Object} book
   * @returns {Boolean}
   */
  isJsonEmpty(book) {
    if (book.length === 0) {
      return true;
    } else {
      return false;
    }
  }
}
