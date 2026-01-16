# Next.js序列化错误修复说明

## 问题描述

在访问行程总览页面时,出现以下错误:

```
Error serializing `.itinerary[0].date` returned from `getStaticProps`
Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value.
```

## 根本原因

Next.js的`getStaticProps`返回的数据会被序列化为JSON,但**JavaScript的`undefined`无法被序列化**。

### 为什么会有undefined?

在TypeScript中,可选属性(`property?: type`)默认值是`undefined`:

```typescript
interface DayItinerary {
  day: number;
  date?: string;  // ❌ 可能是 undefined
  theme: string;
}
```

当解析Markdown时,如果没有提取到日期,就会返回`undefined`。

## ✅ 已修复内容

### 1. 修改类型定义

**修改前**:
```typescript
export interface DayItinerary {
  day: number;
  date?: string;  // ❌ undefined
  theme: string;
  items: ItineraryItem[];
}

export interface ItineraryItem {
  time: string;
  type: 'attraction' | 'meal' | 'transport' | 'hotel';
  title: string;
  description?: string;  // ❌ undefined
  location?: string;     // ❌ undefined
  tips?: string[];       // ❌ undefined
  icon?: string;         // ❌ undefined
}
```

**修改后**:
```typescript
export interface DayItinerary {
  day: number;
  date: string | null;  // ✅ null
  theme: string;
  items: ItineraryItem[];
}

export interface ItineraryItem {
  time: string;
  type: 'attraction' | 'meal' | 'transport' | 'hotel';
  title: string;
  description: string | null;  // ✅ null
  location: string | null;     // ✅ null
  tips: string[] | null;       // ✅ null
  icon: string | null;         // ✅ null
}
```

### 2. 修改解析函数

**修改前**:
```typescript
const date = dateMatch ? dateMatch[1] : undefined;  // ❌

items.push({
  time,
  type,
  title: activity,
  description: tips || undefined,  // ❌
  tips: tipsList.length > 0 ? tipsList : undefined,  // ❌
});
```

**修改后**:
```typescript
const date = dateMatch ? dateMatch[1] : null;  // ✅

items.push({
  time,
  type,
  title: activity,
  description: tips || null,  // ✅
  location: null,  // ✅
  tips: tipsList.length > 0 ? tipsList : null,  // ✅
  icon: null,  // ✅
});
```

### 3. 修改默认数据

**修改前**:
```typescript
days.push({
  day: i,
  theme: `第${i}天`,
  items: [{
    time: '09:00',
    type: 'attraction',
    title: '暂无详细行程数据',
    description: '请查看攻略详情页了解完整行程安排',
    // ❌ 缺少其他字段,默认undefined
  }],
});
```

**修改后**:
```typescript
days.push({
  day: i,
  date: null,  // ✅
  theme: `第${i}天`,
  items: [{
    time: '09:00',
    type: 'attraction',
    title: '暂无详细行程数据',
    description: '请查看攻略详情页了解完整行程安排',
    location: null,  // ✅
    tips: null,      // ✅
    icon: null,      // ✅
  }],
});
```

## 📝 修改的文件

1. ✅ `src/types/guide.ts` - 类型定义
2. ✅ `src/pages/itinerary/[city].tsx` - 解析函数
3. ✅ `src/lib/markdown.ts` - 之前已修复(budget, season)

## 🧪 验证方法

### 1. 检查浏览器

访问: http://localhost:3000/itinerary/beijing

**预期结果**: 页面正常加载,显示时间轴和地图

### 2. 检查开发者工具

按F12打开Console,应该**没有错误**。

### 3. 检查服务器日志

终端应该显示:
```
✓ Compiled in XXXms
GET /itinerary/beijing 200 in XXXms
```

## 💡 经验教训

### Next.js序列化规则

在`getStaticProps`和`getServerSideProps`中:

| 类型 | 可序列化 | 说明 |
|------|---------|------|
| `string` | ✅ | 字符串 |
| `number` | ✅ | 数字 |
| `boolean` | ✅ | 布尔值 |
| `null` | ✅ | 空值 |
| `array` | ✅ | 数组 |
| `object` | ✅ | 普通对象 |
| `undefined` | ❌ | **不可序列化** |
| `function` | ❌ | 函数 |
| `Date` | ❌ | 日期对象(需转为字符串) |
| `Map/Set` | ❌ | 需转为数组/对象 |

### 最佳实践

1. **避免可选属性**: 使用`type | null`代替`type?`
2. **显式赋值null**: 确保所有字段都有值
3. **类型检查**: 使用TypeScript严格模式
4. **序列化测试**: 用`JSON.stringify()`测试数据

### TypeScript配置建议

在`tsconfig.json`中启用:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## 🔍 如何调试序列化错误

### 1. 找到问题字段

错误信息会告诉你具体字段:
```
Error serializing `.itinerary[0].date`
                     ^^^^^^^^^^^^^^^^
                     这个字段有问题
```

### 2. 检查数据源

在`getStaticProps`中添加日志:

```typescript
export const getStaticProps = async () => {
  const data = parseData();
  
  // 检查是否有undefined
  console.log('Data:', JSON.stringify(data, null, 2));
  
  return { props: { data } };
};
```

### 3. 使用辅助函数

创建清理函数:

```typescript
function removeUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 使用
return {
  props: {
    data: removeUndefined(data)
  }
};
```

## ✅ 修复完成

现在刷新页面,错误应该消失了!

如果还有问题:
1. 检查浏览器Console
2. 检查服务器终端输出
3. 清除`.next`缓存: `rm -rf .next` (或删除.next文件夹)
4. 重启开发服务器: `npm run dev`
