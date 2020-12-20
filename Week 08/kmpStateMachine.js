class KmpStateMachine {
  constructor(pattern) {
    this.currentState = null;
    this.pattern = pattern;

    this.stateEnd = this.stateEnd.bind(this);
    this.generateKmpNextTable = this.generateKmpNextTable.bind(this);
    this.generateStateFuncs = this.generateStateFuncs.bind(this);

    this.table = this.generateKmpNextTable(pattern);
    this.stateFuncs = this.generateStateFuncs(this.pattern, this.table);

  }

  stateEnd() {
    return this.stateEnd;
  }

  // 参考第四周 kmp 算法 table 生成
  generateKmpNextTable(pattern) {
    let table = new Array(pattern.length).fill(0);

    table[0] = -1;
    let i = 1;
    let j = 0;

    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        ++j, ++i;
        table[i] = j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
    }

    // 保持数组不超过 pattern 长度，对计算无影响，只是符合 next 的长度规范
    return table.slice(0, pattern.length);
  }

  // 批量生成状态改变函数
  generateStateFuncs(pattern, kmpTable) {
    let { length } = pattern;
    let stateFuncs = new Array(length);

    for (let i = 0; i < length; i++) {
      stateFuncs[i] = char => {
        if (char === pattern[i]) {
          let next = i + 1;
          // 向后匹配，如果 next 索引越界，则状态调整为终结态
          return next === length ? this.stateEnd : stateFuncs[next];
        } else {
          // 向前回溯，根据 kmp nextTable 获取可以回溯的上一个状态，直至初始状态
          return i > 0 ? stateFuncs[kmpTable[i]](char) : stateFuncs[0];
        }
      }
    }

    return stateFuncs;
  }

  match(str) {
    this.currentState = this.stateFuncs[0];
    for (let char of str) {
      this.currentState = this.currentState(char);
    }
    let matched = this.currentState === this.stateEnd;
    this.currentState = null;
    return matched;
  }
}

const kmpMachine1 = new KmpStateMachine('abcabx');
const kmpMachine2 = new KmpStateMachine('abababc');
const kmpMachine3 = new KmpStateMachine('aaaa');

console.log('expected return true: ', kmpMachine1.match('abcabx'))
console.log('expected return true: ', kmpMachine1.match('abcabcabx'))
console.log('expected return false: ', kmpMachine1.match('abcabcababx'))
console.log('expected return false: ', kmpMachine1.match('abcabc'))

console.log('expected return true: ', kmpMachine2.match('abcabababca'))
console.log('expected return false: ', kmpMachine2.match('abcababcabca'))

console.log('expected return false: ', kmpMachine3.match('abaaaba'))
console.log('expected return true: ', kmpMachine3.match('abaaaaba'))


