//  执行命令的方法
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
//  从命令行获取数据
const getProcessArgs = () => {
  // 从命令行得到的参数数组
  const args = process.argv.slice(2);
  // 要做一下格式转换处理
  const argObject = {};
  args.forEach((argString, argStringIndex) => {
    if (argStringIndex % 2 === 0 && args[argStringIndex + 1]) {
      argObject[args[argStringIndex]] = args[argStringIndex + 1];
    }
  });
  return argObject;
};
//  输出文案并且推出
const exitSay = (_text) => {
  console.log(_text);
  process.exit(1);
};


//  要新建的 tag
const newTags = getProcessArgs().t || getProcessArgs().T;
//  项目路径
const proPath = path.join(__dirname, '..');
//  打 tag 的文案
const tagManage = getProcessArgs().m || getProcessArgs().M;
if (!fs.existsSync(proPath)) {
  exitSay('路径不存在');
}


//  切入项目文件夹
const cutIntoFolder = `cd ${proPath} && `;



//  获取命令返回的结果
const getShellResult = (str) => {
  return String(execSync(`${cutIntoFolder}${str}`, {
    timeout: 100000
  }));
};


//  查看项目是否有文件未提交
const proStatus = getShellResult(`git status`);
if (proStatus.includes('git add')) {
  exitSay('请先提交代码!');
}
//  获取本地分支信息
const getCurrentBranch = () => {
  //  获取本地数组
  return getShellResult(`git branch`).replace(/ /g, '')
      .split('\n').filter(item => item.includes('*'))
      .toString().replace(/\*/g, '');
};


//  获取当前分支
const currentBranch = getCurrentBranch();
//  如果没有处在 master
if (currentBranch !== 'master') {
  getShellResult('git checkout master');
}



//  干掉其它所有分支，剩下 master
getShellResult(`git branch | grep -v "master" | xargs git branch -D`);


//  清除本地所有缓存
getShellResult('git tag -l | xargs git tag -d && git fetch -t -p -f && git remote prune origin');
//  切换回主干，准备打 tag
getShellResult('git checkout develop');

if (newTags) {
  const addTag = `git tag -a ${newTags} -m '${ tagManage ? tagManage : `自动发版 ${newTags}`}'`;
  getShellResult(addTag);
}
