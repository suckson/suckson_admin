<h1>Suckson admin🎉🎉（Element plus）</h1>
</div>

## 简介
Suckson admin 是一个免费开源的中后台模版。使用了最新的`vue3.0+`,`vite2`, `Element plus+`等主流技术开发，开箱即用的中后台前端解决方案。后端采用很火框架[若依](https://doc.ruoyi.vip)，在使用若依的过程中发现若依的前端封装很不易用，结合以前的工作经验，封装了一些常用的。开箱即用。当然也提供了一些有用但不是很完美的业务组件封装。希望能对大家有所帮助。

## code 哲学
     `简单` AND `清晰` 不管逻辑有多麽复杂！编写代码++命名代码的原则是：少写代码+清爽。
    
## 组件
- `SearchForm` **头部搜索**
- `ProTable` **表格**
- `ImageUpload` **图片上传**
- `FileUpload` **文件上传**
- `DictTag` **标签**
- `CopyText` **文字copy**
- `FormDrawer` **抽屉表单**
- `FormModal` **弹窗表单**
- [And More!!!](https://github.com/scoopcn/scoopcn/tree/master/bucket)

## 特性

1 自动生成路由
  `view`路径下的目录自动根据路由,自动注册，后台配置菜单，结合权限系统使用。

2、自动生成API
@bin /api /index 自动生成，只需要自己配置APIfox  相应的连接地址即可自动生成API，文档详见 

3、移动端适配方案
关于移动端rem常用布局，在paid，或者等比例缩放的情况加，作者封装了常见的class。已方便市场的开发。

4、Cesium库常见功能封装
cesium，绘制模型，三维数据坐标转换。

## 账号
admin/123456

## 安装教程

```bash
cd suckson-admin

yarn install

```

- 运行

```bash
yarn dev
```

- 打包

```bash
yarn build
```
## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中



## 项目目录介绍
``` 
|-- bin     //基础库封装文件夹
    |-- map     //地图封装的文件夹 
    |-- request //请求封装文件夹  
    |-- router  //路由处理文件夹
    |-- store   //全局状态库vuex的文件夹
    |-- utils   //公共方法的文件夹
|-- config  //配置文件的文件夹
|-- public  //静态资源文件夹
|-- src //业务处理部分
    |-- components  //公共组件库文件夹   
    |-- page    //页面组件文件夹
|-- index.html  //项目入口文件
|-- package.json    //包管理配置文件
|-- vite.config.js  //vite脚手架配置文件
```

## 项目技术栈
- vite  
- vue3        
- vue-router 
- vuex        
- axios     
- sass     
- cesium    
## 交流 + 喝咖啡
Suckson-Admin 是完全开源免费的项目，在帮助开发者更方便地进行中大型管理系统开发，作者wx：suckson





