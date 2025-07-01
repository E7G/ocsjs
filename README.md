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

</div>

### ✨ 功能增强

#### 🎯 优学院自动答题支持
> 目前支持判断题、单选题和多选题的自动作答

- ✅ 判断题自动识别与作答
- ✅ 单选题智能匹配与选择
- ✅ 多选题答案解析与提交
- 🔄 答案匹配逻辑优化（判断题强制改icon为文本）

### 🐛 问题修复

#### tikuAdapter 集成优化
- 🔧 修正类型判断逻辑
  - `completion` → 2
  - `judgement` → 3
- 🎯 优化题库设置
  - 移除强制使用tikuAdapter格式的限制

### ⚙️ 配置优化

- 📊 题库设置优化
  - 优化提交策略
  - 设置 tikuAdapter 为默认题库

### 🔧 推荐工具

#### 📚 本地题库工具
> [E7G/tikulocal](https://github.com/E7G/tikulocal)
- ✅ 兼容 tikuAdapter 的 local 部分 API
- 🔨 解决定制版中 local 部分问题

#### 📝 题库适配器
> [NUnzOSz/tikuAdapter](https://github.com/NUnzOSz/tikuAdapter)
- ⚠️ docx导入部分存在已知问题
  - 难以区分题号和题目中的`.`
  - 可能导致题目分割错误
- 📌 基于 [DokiDoki1103/tikuAdapter](https://github.com/DokiDoki1103/tikuAdapter)

### 📝 更多信息

- 详细修改记录：[commit 3fcfc7e](https://github.com/E7G/ocsjs/commit/3fcfc7e0a4f2397e7fe9d38077af098ea93f9d20#diff-5e7ab1b2d42699a89e9039d31a3f58c01cf7a236b50826b100cef0504d472e7e)

<div align="center">

## 📚 官网及教程

### [https://docs.ocsjs.com](https://docs.ocsjs.com)

</div>
