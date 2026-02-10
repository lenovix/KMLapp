import cloudscraper
from bs4 import BeautifulSoup

def scrape_full_data():
    scraper = cloudscraper.create_scraper(
        browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
    )
    
    url = ""
    
    try:
        print(f"Mengakses {url}...")
        response = scraper.get(url, timeout=15)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            info_div = soup.find('div', id='info')
            
            if not info_div:
                print("Gagal menemukan container info.")
                return

            title_tag = info_div.find('h1', class_='title')
            full_title = title_tag.get_text(separator=" ", strip=True) if title_tag else "N/A"
            
            gallery_id = info_div.find('h3', id='gallery_id').get_text(strip=True).replace('#', '') if info_div.find('h3', id='gallery_id') else "N/A"

            print(f"\nID: {gallery_id}")
            print(f"Judul: {full_title}")
            print("-" * 30)

            tag_sections = info_div.find_all('div', class_='tag-container')
            
            data_result = {}
            for section in tag_sections:
                field_name = section.get_text(strip=True).split(':')[0]
                
                tags_list = []
                for tag_span in section.find_all('span', class_='name'):
                    tags_list.append(tag_span.get_text(strip=True))
                
                if tags_list:
                    data_result[field_name] = ", ".join(tags_list)
                    print(f"{field_name:12}: {data_result[field_name]}")

        else:
            print(f"Ditolak server. Status: {response.status_code}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    scrape_full_data()