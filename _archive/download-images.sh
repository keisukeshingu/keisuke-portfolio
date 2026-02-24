#!/usr/bin/env bash
# download-images.sh — Self-host all external portfolio images
# Run from the keisuke-portfolio/ root directory:
#   chmod +x download-images.sh && ./download-images.sh

set -e
mkdir -p images/external
echo "Downloading portfolio images..."

echo "  1200px-all-round_phototypesetter_mc-6.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/1200px-all-round_phototypesetter_mc-6.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/All-round%20Phototypesetter%20MC-6.jpg/1200px-All-round%20Phototypesetter%20MC-6.jpg" || echo "  FAILED: 1200px-all-round_phototypesetter_mc-6.jpg"

echo "  1200px-macworld_2005_2.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/1200px-macworld_2005_2.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Macworld_2005_2.jpg/1200px-Macworld_2005_2.jpg" || echo "  FAILED: 1200px-macworld_2005_2.jpg"

echo "  17155.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/17155.jpg" \
  "https://data.ukiyo-e.org/aggv/images/17155.jpg" || echo "  FAILED: 17155.jpg"

echo "  17874.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/17874.jpg" \
  "https://data.ukiyo-e.org/aggv/images/17874.jpg" || echo "  FAILED: 17874.jpg"

echo "  21909.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/21909.jpg" \
  "https://data.ukiyo-e.org/aggv/images/21909.jpg" || echo "  FAILED: 21909.jpg"

echo "  22062.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/22062.jpg" \
  "https://data.ukiyo-e.org/aggv/images/22062.jpg" || echo "  FAILED: 22062.jpg"

echo "  400px-raster-systeme-cover.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/400px-raster-systeme-cover.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Raster-Systeme-Cover.jpg/400px-Raster-Systeme-Cover.jpg" || echo "  FAILED: 400px-raster-systeme-cover.jpg"

echo "  800px-1959_-kunsthalle_basel-_4_bildhauer.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-1959_-kunsthalle_basel-_4_bildhauer.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/1959_-Kunsthalle_Basel-_4_Bildhauer.jpg/800px-1959_-Kunsthalle_Basel-_4_Bildhauer.jpg" || echo "  FAILED: 800px-1959_-kunsthalle_basel-_4_bildhauer.jpg"

echo "  800px-all-round_phototypesetter_mc-6.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-all-round_phototypesetter_mc-6.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/All-round%20Phototypesetter%20MC-6.jpg/800px-All-round%20Phototypesetter%20MC-6.jpg" || echo "  FAILED: 800px-all-round_phototypesetter_mc-6.jpg"

echo "  800px-anatomy_of_a_murder_poster.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-anatomy_of_a_murder_poster.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Anatomy_of_a_Murder_poster.jpg/800px-Anatomy_of_a_Murder_poster.jpg" || echo "  FAILED: 800px-anatomy_of_a_murder_poster.jpg"

echo "  800px-asahi_shimbun_1941-08-26_1.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-asahi_shimbun_1941-08-26_1.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Asahi%20Shimbun%201941-08-26%201.jpg/800px-Asahi%20Shimbun%201941-08-26%201.jpg" || echo "  FAILED: 800px-asahi_shimbun_1941-08-26_1.jpg"

echo "  800px-asahi_shimbun_evening_edition_newspaper_clipping__2814_july_1959_issue_29."
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-asahi_shimbun_evening_edition_newspaper_clipping__2814_july_1959_issue_29." \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Asahi%20Shimbun%20Evening%20Edition%20newspaper%20clipping%20%2814%20July%201959%20issue%29.jpg/800px-Asahi%20Shimbun%20Evening%20Edition%20newspaper%20clipping%20%2814%20July%201959%20issue%29.jpg" || echo "  FAILED: 800px-asahi_shimbun_evening_edition_newspaper_clipping__2814_july_1959_issue_29."

echo "  800px-ernst_keller_image3.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-ernst_keller_image3.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Ernst_keller_image3.jpg/800px-Ernst_keller_image3.jpg" || echo "  FAILED: 800px-ernst_keller_image3.jpg"

echo "  800px-iht_masthead.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-iht_masthead.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/IHT_masthead.JPG/800px-IHT_masthead.JPG" || echo "  FAILED: 800px-iht_masthead.jpg"

echo "  800px-linotype_machine_1.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-linotype_machine_1.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Linotype_machine_1.jpg/800px-Linotype_machine_1.jpg" || echo "  FAILED: 800px-linotype_machine_1.jpg"

echo "  800px-musica_viva._mueller-brockmann.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-musica_viva._mueller-brockmann.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Musica%20Viva.%20M%C3%BCller-Brockmann.jpg/800px-Musica%20Viva.%20M%C3%BCller-Brockmann.jpg" || echo "  FAILED: 800px-musica_viva._mueller-brockmann.jpg"

echo "  800px-the_man_with_the_golden_arm_poster.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-the_man_with_the_golden_arm_poster.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Man_with_the_Golden_Arm_poster.jpg/800px-The_Man_with_the_Golden_Arm_poster.jpg" || echo "  FAILED: 800px-the_man_with_the_golden_arm_poster.jpg"

echo "  800px-tm_typographische_monatsblaetter_1961_01.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-tm_typographische_monatsblaetter_1961_01.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/TM_Typographische_Monatsbl%C3%A4tter_1961_01.jpg/800px-TM_Typographische_Monatsbl%C3%A4tter_1961_01.jpg" || echo "  FAILED: 800px-tm_typographische_monatsblaetter_1961_01.jpg"

echo "  800px-tokyo_asahi_shinbun_1922-01-27_01.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/800px-tokyo_asahi_shinbun_1922-01-27_01.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Tokyo%20Asahi%20Shinbun%201922-01-27%2001.jpg/800px-Tokyo%20Asahi%20Shinbun%201922-01-27%2001.jpg" || echo "  FAILED: 800px-tokyo_asahi_shinbun_1922-01-27_01.jpg"

echo "  ahr0cdovl3d3dy5ibg9ny2rulmnvbs93d3cuzw5nywrnzxquy29tl21lzglhlziwmtmvmdcvbwlzzwx1.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/ahr0cdovl3d3dy5ibg9ny2rulmnvbs93d3cuzw5nywrnzxquy29tl21lzglhlziwmtmvmdcvbwlzzwx1.jpg" \
  "https://s.yimg.com/ny/api/res/1.2/wfMZkadaV0EpupZ6iKeD4Q--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTU0MA--/https://o.aolcdn.com/images/dar/5845cadfecd996e0372f/84767bd0f8aa32f8e235409ea5f2aa243dd52fc9/aHR0cDovL3d3dy5ibG9nY2RuLmNvbS93d3cuZW5nYWRnZXQuY29tL21lZGlhLzIwMTMvMDcvbWlzZWx1YzI0a2V5Ym9hcmRsZWFkMDIuanBn" || echo "  FAILED: ahr0cdovl3d3dy5ibg9ny2rulmnvbs93d3cuzw5nywrnzxquy29tl21lzglhlziwmtmvmdcvbwlzzwx1.jpg"

echo "  apple-wwdc24-watchos-11-apple-watch-3-up-240610_big.jpg.large.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/apple-wwdc24-watchos-11-apple-watch-3-up-240610_big.jpg.large.jpg" \
  "https://www.apple.com/newsroom/images/2024/06/watchos-11-brings-powerful-health-and-fitness-insights/article/Apple-WWDC24-watchOS-11-Apple-Watch-3-up-240610_big.jpg.large.jpg" || echo "  FAILED: apple-wwdc24-watchos-11-apple-watch-3-up-240610_big.jpg.large.jpg"

echo "  apple-wwdc24-watchos-11-training-load-apple-watch-and-iphone-240610_inline.jpg.l"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/apple-wwdc24-watchos-11-training-load-apple-watch-and-iphone-240610_inline.jpg.l" \
  "https://www.apple.com/newsroom/images/2024/06/watchos-11-brings-powerful-health-and-fitness-insights/article/Apple-WWDC24-watchOS-11-training-load-Apple-Watch-and-iPhone-240610_inline.jpg.large.jpg" || echo "  FAILED: apple-wwdc24-watchos-11-training-load-apple-watch-and-iphone-240610_inline.jpg.l"

echo "  disrupt_sf16_boston_dynamics-4311.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/disrupt_sf16_boston_dynamics-4311.jpg" \
  "https://techcrunch.com/wp-content/uploads/2016/09/disrupt_sf16_boston_dynamics-4311.jpg?w=680" || echo "  FAILED: disrupt_sf16_boston_dynamics-4311.jpg"

echo "  disrupt_sf16_stephen_curry-3945.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/disrupt_sf16_stephen_curry-3945.jpg" \
  "https://techcrunch.com/wp-content/uploads/2016/09/disrupt_sf16_stephen_curry-3945.jpg?w=680" || echo "  FAILED: disrupt_sf16_stephen_curry-3945.jpg"

echo "  disrupt_sf16_winner-4505.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/disrupt_sf16_winner-4505.jpg" \
  "https://techcrunch.com/wp-content/uploads/2016/09/disrupt_sf16_winner-4505.jpg?w=1024" || echo "  FAILED: disrupt_sf16_winner-4505.jpg"

echo "  dscn1778.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/dscn1778.jpg" \
  "https://data.ukiyo-e.org/aggv/images/dscn1778.jpg" || echo "  FAILED: dscn1778.jpg"

echo "  edclv2022_0520_185836-7168_smb_720h-525x350.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/edclv2022_0520_185836-7168_smb_720h-525x350.jpg" \
  "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/2022/06/01211357/EDCLV2022_0520_185836-7168_SMB_720h-525x350.jpg" || echo "  FAILED: edclv2022_0520_185836-7168_smb_720h-525x350.jpg"

echo "  font_manager_palette_in_quarkxpress_2024.png"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/font_manager_palette_in_quarkxpress_2024.png" \
  "https://upload.wikimedia.org/wikipedia/commons/f/f0/Font_Manager_Palette_in_QuarkXPress_2024.png" || echo "  FAILED: font_manager_palette_in_quarkxpress_2024.png"

echo "  img-ce-gallery-traktor-pro-4-product-page-02-gallery-a-main-new-bdc5e8f4a0cb7f43.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/img-ce-gallery-traktor-pro-4-product-page-02-gallery-a-main-new-bdc5e8f4a0cb7f43.jpg" \
  "https://www.native-instruments.com/typo3temp/pics/img-ce-gallery-traktor-pro-4-product-page-02-gallery-a-main-new-bdc5e8f4a0cb7f43a750233be2e1a9b2-d@2x.jpg" || echo "  FAILED: img-ce-gallery-traktor-pro-4-product-page-02-gallery-a-main-new-bdc5e8f4a0cb7f43.jpg"

echo "  img-welcome-hero-traktor-pro-4-hero-updated-8886c1ee796862446eab18ae20d52d3f-d_2.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/img-welcome-hero-traktor-pro-4-hero-updated-8886c1ee796862446eab18ae20d52d3f-d_2.jpg" \
  "https://www.native-instruments.com/typo3temp/pics/img-welcome-hero-traktor-pro-4-hero-updated-8886c1ee796862446eab18ae20d52d3f-d@2x.jpg" || echo "  FAILED: img-welcome-hero-traktor-pro-4-hero-updated-8886c1ee796862446eab18ae20d52d3f-d_2.jpg"

echo "  kv_top.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/kv_top.jpg" \
  "https://gmpj.bn-ent.net/images/en/top/kv_top.jpg?v=20250409" || echo "  FAILED: kv_top.jpg"

echo "  machine_learning_categorization_en.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/machine_learning_categorization_en.jpg" \
  "https://www.tdk.com/system/files/featured_stories/machine_learning_categorization_en.jpg" || echo "  FAILED: machine_learning_categorization_en.jpg"

echo "  machine_management.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/machine_management.jpg" \
  "https://www.tdk.com/system/files/featured_stories/machine_management.jpg" || echo "  FAILED: machine_management.jpg"

echo "  miseluc24keyboardlead01.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/miseluc24keyboardlead01.jpg" \
  "https://s.yimg.com/ny/api/res/1.2/5pCym4IeWhXagfJtXpfvfw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTYzNw--/https://s.yimg.com/uu/api/res/1.2/accx1tCvc5pvzE80CcT9Ug--~B/aD00MTE7dz02MTk7YXBwaWQ9eXRhY2h5b24-/https://www.blogcdn.com/www.engadget.com/media/2013/07/miseluc24keyboardlead01.jpg" || echo "  FAILED: miseluc24keyboardlead01.jpg"

echo "  motor_monitoring_demonstration.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/motor_monitoring_demonstration.jpg" \
  "https://www.tdk.com/system/files/featured_stories/motor_monitoring_demonstration.jpg" || echo "  FAILED: motor_monitoring_demonstration.jpg"

echo "  nav_av-receivers_avr-a1h.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/nav_av-receivers_avr-a1h.jpg" \
  "https://www.denon.com/on/demandware.static/-/Sites-site-catalog-denon-us/default/dw66c13fcd/navImages/Nav_AV-Receivers_AVR-A1H.jpg" || echo "  FAILED: nav_av-receivers_avr-a1h.jpg"

echo "  platform_img_pc.png"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/platform_img_pc.png" \
  "https://gmpj.bn-ent.net/images/en/top/platform_img_pc.png?v=20250409" || echo "  FAILED: platform_img_pc.png"

echo "  robot-heart-and-the-man.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/robot-heart-and-the-man.jpg" \
  "https://dusttoashes.com/wp-content/uploads/2025/11/Robot-Heart-and-The-Man.jpg" || echo "  FAILED: robot-heart-and-the-man.jpg"

echo "  ryoanji-dry_garden.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/ryoanji-dry_garden.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/9/9b/RyoanJi-Dry_garden.jpg" || echo "  FAILED: ryoanji-dry_garden.jpg"

echo "  ti_q4_e-tron_sportback-hud_01.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/ti_q4_e-tron_sportback-hud_01.jpg" \
  "https://www.audi-technology-portal.de/files/images/_large/TI_Q4_e-tron_Sportback-HUD_01.jpg" || echo "  FAILED: ti_q4_e-tron_sportback-hud_01.jpg"

echo "  ti_q4_e-tron_sportback-hud_02_en.jpg"
curl -fsSL --retry 3 --retry-delay 1 -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -H "Referer: https://www.google.com/" -o "images/external/ti_q4_e-tron_sportback-hud_02_en.jpg" \
  "https://www.audi-technology-portal.de/files/images/_large/TI_Q4_e-tron_Sportback-HUD_02_en.jpg" || echo "  FAILED: ti_q4_e-tron_sportback-hud_02_en.jpg"

echo ""
echo "Done. Images saved to images/external/"
echo "Count: $(ls images/external | wc -l) files"