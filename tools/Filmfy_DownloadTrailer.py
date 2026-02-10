from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException
from webdriver_manager.chrome import ChromeDriverManager
import requests
import os
import time

def get_video_src_with_retry(driver, wait, retries=3):
    """Fungsi khusus untuk menangani elemen yang suka hilang/berubah (stale)"""
    for i in range(retries):
        try:
            # Tunggu sampai tag video muncul
            video_element = wait.until(EC.presence_of_element_located((By.TAG_NAME, "video")))
            
            # Tarik SRC secepat mungkin
            src = video_element.get_attribute("src")
            
            # Jika src kosong, cek tag <source> di dalamnya
            if not src:
                source_element = video_element.find_element(By.TAG_NAME, "source")
                src = source_element.get_attribute("src")
            
            if src:
                return src
        except StaleElementReferenceException:
            print(f"Percobaan {i+1}: Elemen berubah tiba-tiba, mencoba lagi...")
            time.sleep(1) # Beri jeda sebentar untuk re-render
        except Exception as e:
            print(f"Gagal di percobaan {i+1}: {e}")
    return None

def download_jav_trailer(url):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 15)

    try:
        print(f"Mengakses: {url}")
        driver.get(url)

        # Kadang perlu trigger scroll sedikit agar video dimuat
        driver.execute_script("window.scrollTo(0, 300);")
        
        print("Mencari link video...")
        video_url = get_video_src_with_retry(driver, wait)

        if video_url:
            # Filter jika link-nya adalah 'blob:...' (ini butuh teknik berbeda)
            if video_url.startswith('blob:'):
                print("Link berupa BLOB. Butuh teknik Network Log. Mencoba mencari link mentah...")
                # Jika blob, link mp4 biasanya ada di attribute 'src' di tab network
                # Tapi kita coba dulu cara standar ini.
            
            print(f"Link ditemukan: {video_url}")
            file_name = "trailer_result.mp4"
            
            print("Memulai pengunduhan...")
            # Menggunakan stream agar tidak memakan RAM
            with requests.get(video_url, stream=True) as r:
                r.raise_for_status()
                with open(file_name, 'wb') as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        f.write(chunk)
            
            print(f"Sukses! Tersimpan di: {os.path.abspath(file_name)}")
        else:
            print("Gagal mendapatkan link video setelah beberapa kali percobaan.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    target = "https://javtrailers.com/video/juy00841"
    download_jav_trailer(target)