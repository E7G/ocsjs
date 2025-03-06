<div align="center">

<div style="padding:8px;border-radius:100%;background:white;width:124px;height:124px">
<img src="https://cdn.ocsjs.com/resources/img/logo.png" width=124 height=124  >
</div>

# OCS 网课助手

> OCS (Online Course Script) 网课刷课脚本，帮助大学生解决网课难题

![GitHub Repo stars](https://img.shields.io/github/stars/ocsjs/ocsjs)
![npm](https://img.shields.io/npm/v/ocsjs?color=red)
![NPM](https://img.shields.io/npm/l/ocsjs)
![今日安装](https://img.shields.io/badge/dynamic/json?color=orange&label=今日安装&query=$.data.today_install&url=https://scriptcat.org/api/v2/scripts/367)
![总共安装](https://img.shields.io/badge/dynamic/json?color=red&label=总共安装&query=$.data.total_install&url=https://scriptcat.org/api/v2/scripts/367)

</div>

<div align="center">

## 🛠️ 此 Fork 改进说明

### 功能增强
✅ 新增优学院（uxy.ts）作业自动答题支持（目前只有判断题）  
- 初步实现判断题自动作答功能  
- 优化答案匹配逻辑与平台兼容性  （判断题强制改icon为文本）

### 问题修复
🐛 修正 tikuAdapter 集成类型判断  
- 将 `env.type` 条件判断修正为：  
  `completion` → 2 / `judgement` → 3  
🐛 修复 tikuAdapter 的题库设置问题
- 删除识别到 tikuAdapter 格式网址就强制使用该格式题库的代码

### 配置优化
⚙️ 调整默认设置项  
- 优化题库设置和提交策略  
- 设置 tikuAdapter 为默认题库

### 推荐项目
📚 改进版题库适配器  
推荐使用 [NUnzOSz/tikuAdapter](https://github.com/NUnzOSz/tikuAdapter) 定制版  
（原项目 [DokiDoki1103/tikuAdapter](https://github.com/DokiDoki1103/tikuAdapter) ）

📝 详细修改参见：[commit 3fcfc7e](https://github.com/E7G/ocsjs/commit/3fcfc7e0a4f2397e7fe9d38077af098ea93f9d20#diff-5e7ab1b2d42699a89e9039d31a3f58c01cf7a236b50826b100cef0504d472e7e)

</div>
 
<div align="center">

## 官网及教程 [https://docs.ocsjs.com](https://docs.ocsjs.com)

</div>
