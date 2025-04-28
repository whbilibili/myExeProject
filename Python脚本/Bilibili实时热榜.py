import requests
from bs4 import BeautifulSoup
import time

# Bilibili 全站排行榜 URL
URL = "https://www.bilibili.com/v/popular/rank/all"

# 伪装成浏览器的 Headers，降低被识别为爬虫的风险
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Referer': 'https://www.bilibili.com/'
}

def fetch_bilibili_hot_list():
    """
    获取并解析 Bilibili 实时热榜数据。
    返回一个包含热榜项目的列表，每个项目是一个字典；如果失败则返回 None。
    """
    try:
        print(f"正在访问: {URL}")
        # 发送 GET 请求
        response = requests.get(URL, headers=HEADERS, timeout=15) # 设置超时
        response.raise_for_status() # 检查请求是否成功 (状态码 2xx)
        response.encoding = response.apparent_encoding # 确保编码正确

        print("页面获取成功，正在解析...")

        # 使用 BeautifulSoup 解析 HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # 查找包含排行榜项目的列表容器 (根据 B 站当前结构，类名可能改变)
        # 注意：网站结构可能会变化，这个选择器需要根据实际情况调整
        rank_list_container = soup.select_one('ul.rank-list')
        if not rank_list_container:
            print("错误：未能找到排行榜列表容器 (ul.rank-list)。页面结构可能已更新。")
            return None

        # 查找列表中的所有项目
        items = rank_list_container.select('li.rank-item')
        if not items:
            print("错误：未能找到排行榜项目 (li.rank-item)。")
            return None

        print(f"找到 {len(items)} 个热榜项目，开始提取信息...")

        hot_list_data = []
        for item in items:
            try:
                # 提取排名
                rank_tag = item.select_one('div.num')
                rank = rank_tag.text.strip() if rank_tag else 'N/A'

                # 提取标题和链接
                title_tag = item.select_one('a.title')
                title = title_tag.text.strip() if title_tag else 'N/A'
                link = title_tag['href'].strip() if title_tag and title_tag.has_attr('href') else 'N/A'
                # 处理 // 开头的链接，补全协议
                if link.startswith('//'):
                    link = 'https:' + link

                # 提取 UP 主信息
                uploader_tag = item.select_one('span.up-name')
                uploader = uploader_tag.text.strip() if uploader_tag else 'N/A'

                # 提取其他数据（播放量、评论等，结构可能复杂且易变）
                # 这些数据通常在 div.detail > span.data-box 中
                detail_tags = item.select('div.detail > span.data-box')
                details = [tag.text.strip() for tag in detail_tags]

                hot_list_data.append({
                    'rank': rank,
                    'title': title,
                    'link': link,
                    'uploader': uploader,
                    'details': ' | '.join(details) # 将数据合并成一个字符串
                })
            except Exception as e:
                print(f"解析单个项目时出错: {e} - Rank: {rank}")
                # 选择性地打印部分出错的 HTML 以便调试
                # print(item.prettify()[:300])
                continue # 跳过这个项目，继续处理下一个

        return hot_list_data

    except requests.exceptions.Timeout:
        print(f"错误：请求超时 ({URL})")
        return None
    except requests.exceptions.RequestException as e:
        print(f"错误：请求 Bilibili 页面失败: {e}")
        return None
    except Exception as e:
        print(f"错误：处理过程中发生意外错误: {e}")
        return None

if __name__ == "__main__":
    start_time = time.time()
    hot_list = fetch_bilibili_hot_list()
    end_time = time.time()

    if hot_list:
        print("\n" + "="*40)
        print("      Bilibili 实时热榜 (部分数据) ")
        print("="*40)
        for video in hot_list:
            print(f"排名: {video['rank']}")
            print(f"标题: {video['title']}")
            print(f"UP主: {video['uploader']}")
            print(f"链接: {video['link']}")
            print(f"数据: {video['details']}")
            print("-" * 20)

        print(f"\n成功获取 {len(hot_list)} 条数据，耗时 {end_time - start_time:.2f} 秒。")
        print("提醒：'数据'字段可能包含综合得分、播放、评论等混合信息，具体含义需参照原网页。")
    else:
        print("\n获取 Bilibili 热榜失败。")
