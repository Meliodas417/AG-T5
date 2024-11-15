from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def get_jd_books():
    driver = webdriver.Chrome()
    driver.get("https://search.jd.com/Search?keyword=%E4%BA%AC%E4%B8%9C%E5%9B%BE%E4%B9%A6&psort=3&wq=%E4%BA%AC%E4%B8%9C%E5%9B%BE%E4%B9%A6&psort=3&pvid=96be2cf41f3c49a8a0182368cdb48ab7&icon=10004243&click=2")
    
    # 给页面加载一些时间
    time.sleep(5)
    
    # 更新选择器
    items = driver.find_elements(By.CSS_SELECTOR, ".gl-item")
    
    books = []
    for item in items:
        try:
            title = item.find_element(By.CSS_SELECTOR, ".p-name em").text
            price = item.find_element(By.CSS_SELECTOR, ".p-price strong").text
            books.append({
                "title": title,
                "price": price
            })
        except Exception as e:
            print(f"提取数据时出错: {e}")
            continue
# ... existing code ... 