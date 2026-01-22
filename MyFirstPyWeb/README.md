# MyFirstPyWeb 项目

这是一个Python Web开发项目，使用虚拟环境进行依赖管理。

## 环境设置

### 激活虚拟环境
```bash
source venv/bin/activate
```

### 停用虚拟环境
```bash
deactivate
```

### 安装依赖
```bash
pip install -r requirements.txt
```

### 更新requirements.txt
```bash
pip freeze > requirements.txt
```

## 项目信息
- Python版本: 3.10.5
- 虚拟环境路径: ./venv/
- 依赖管理: requirements.txt

## 开发指南
1. 始终在激活虚拟环境后进行开发
2. 安装新包后记得更新requirements.txt
3. 使用black进行代码格式化
4. 使用pytest进行测试

