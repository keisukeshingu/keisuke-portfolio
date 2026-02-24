#!/usr/bin/env python3
"""
Keisuke Shingu — Portfolio Image Library v5
Uses Wikimedia search API to FIND correct filenames, then downloads.
Run: python3 download-images.py
"""

import os, sys, json, time
from urllib.request import Request, urlopen
from urllib.parse import quote
from urllib.error import URLError, HTTPError

BASE = "img/library"
UA = "KeisukeShinGuPortfolio/1.0 (keisuke@gmail.com) Python/urllib"


def api_request(url):
    """Make an API request and return parsed JSON."""
    try:
        req = Request(url, headers={"User-Agent": UA})
        with urlopen(req, timeout=20) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        return None


def get_image_url_by_title(title, width=1280):
    """Try exact title match via imageinfo API."""
    encoded = quote(title, safe=":")
    params = f"action=query&titles={encoded}&prop=imageinfo&iiprop=url"
    if width > 0:
        params += f"&iiurlwidth={width}"
    params += "&format=json"
    data = api_request(f"https://commons.wikimedia.org/w/api.php?{params}")
    if not data:
        return None
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        if page.get("missing") is not None or "imageinfo" not in page:
            return None
        ii = page["imageinfo"][0]
        return ii.get("thumburl") or ii.get("url")
    return None


def search_and_get_url(search_terms, width=1280):
    """Search Wikimedia Commons for images matching search terms, return first result's URL."""
    encoded = quote(search_terms)
    url = (f"https://commons.wikimedia.org/w/api.php?action=query"
           f"&generator=search&gsrsearch={encoded}&gsrnamespace=6&gsrlimit=5"
           f"&prop=imageinfo&iiprop=url"
           + (f"&iiurlwidth={width}" if width > 0 else "")
           + "&format=json")
    data = api_request(url)
    if not data:
        return None, None
    pages = data.get("query", {}).get("pages", {})
    if not pages:
        return None, None
    # Sort by page ID (lower = more established)
    for pid in sorted(pages.keys(), key=lambda x: int(x) if x.lstrip('-').isdigit() else 999999999):
        page = pages[pid]
        title = page.get("title", "")
        ii = page.get("imageinfo", [{}])[0]
        img_url = ii.get("thumburl") or ii.get("url")
        if img_url:
            return title, img_url
    return None, None


def download_file(url, path):
    """Download a file, verify it's not HTML."""
    try:
        req = Request(url, headers={"User-Agent": UA})
        with urlopen(req, timeout=30) as resp:
            data = resp.read()
        if len(data) < 200:
            return False
        header = data[:50].lower()
        if b"<!doctype" in header or b"<html" in header:
            return False
        with open(path, "wb") as f:
            f.write(data)
        return True
    except Exception:
        return False


def is_valid_cached(path):
    """Check if file exists and is a real image (not HTML)."""
    if not os.path.exists(path) or os.path.getsize(path) < 500:
        return False
    with open(path, "rb") as f:
        header = f.read(50).lower()
    return b"<!doctype" not in header and b"<html" not in header


# ════════════════════════════════════════════════════════════════
# Image manifest: (id, folder, filename, exact_title, search_terms, width)
# exact_title: try first; search_terms: fallback search query
# ════════════════════════════════════════════════════════════════

IMAGES = [
    # ── CH5: KYOTO ARCHIVE (001–020) ──
    ("001", "kyoto", "001-kinkakuji-golden-pavilion.jpg",
     "File:Kinkaku-ji the Golden Temple in Kyoto overlooking the lake - high rez.JPG",
     "Kinkaku-ji golden temple Kyoto lake", 1280),
    ("002", "kyoto", "002-fushimi-inari-torii.jpg",
     "File:Fushimi Inari-taisha in Kyoto, November 2016 - 01.jpg",
     "Fushimi Inari torii gates Kyoto", 1280),
    ("003", "kyoto", "003-arashiyama-bamboo.jpg",
     "File:Arashiyama Bamboo Grove, December 2018 - 02.jpg",
     "Arashiyama bamboo grove Kyoto", 1024),
    ("004", "kyoto", "004-ryoanji-rock-garden.jpg",
     "File:Ryoan-ji rock garden close-up.jpg",
     "Ryoanji rock garden Kyoto zen", 1280),
    ("005", "kyoto", "005-itsukushima-noh-stage.jpg",
     "File:ItsukushimaNobutai7442.jpg",
     "Itsukushima Noh stage", 1200),
    ("006", "kyoto", "006-itsukushima-floating-shrine.jpg",
     "File:Itsukushima floating shrine.jpg",
     "Itsukushima floating shrine torii", 1200),
    ("007", "kyoto", "007-itsukushima-dusk.jpg",
     "File:Itsukushima Shrine at dusk.jpg",
     "Itsukushima shrine dusk sunset", 1200),
    ("008", "kyoto", "008-kyoto-station-interior.jpg",
     "File:Kyoto Station Interior.jpg",
     "Kyoto Station interior architecture", 1280),
    ("009", "kyoto", "009-hokusai-great-wave.jpg",
     "File:Tsunami by hokusai 19th century.jpg",
     "Hokusai Great Wave Kanagawa", 1280),
    ("010", "kyoto", "010-kunichika-kabuki-actor.jpg",
     "File:Onoe Kikugoro V as Akitsushima, 1890.jpg",
     "Kunichika kabuki actor woodblock", 800),
    ("011", "kyoto", "011-hiroshige-plum-garden.jpg",
     "File:Hiroshige - Plum Garden at Kameido.jpg",
     "Hiroshige Plum Garden Kameido", 800),
    ("012", "kyoto", "012-kunichika-ichikawa-danjuro.jpg",
     "File:Ichikawa Danjuro IX as Musashibo Benkei in the play Kanjincho, by Toyohara Kunichika (1896).jpg",
     "Kunichika Ichikawa Danjuro Benkei Kanjincho", 800),
    ("013", "kyoto", "013-hokusai-fuji-red.jpg",
     "File:Fine Wind, Clear Morning by Hokusai (from the series Thirty-six Views of Mount Fuji).jpg",
     "Hokusai Fine Wind Clear Morning Red Fuji", 1280),
    ("014", "kyoto", "014-noh-mask-traditional.jpg",
     "File:Masque de Nô (musée Guimet).jpg",
     "Noh mask traditional Japanese theater", 800),
    ("015", "kyoto", "015-tea-ceremony-chanoyu.jpg",
     "File:Tea ceremony performing 2.jpg",
     "Japanese tea ceremony chanoyu matcha", 1280),
    ("016", "kyoto", "016-zen-garden-tofukuji.jpg",
     "File:Tōfuku-ji hojō garden 02.JPG",
     "Tofukuji temple garden Kyoto zen", 1280),
    ("017", "kyoto", "017-japanese-calligraphy.png",
     "File:East Asian calligraphy scheme 02-en.svg",
     "Japanese calligraphy shodo brush", 800),
    ("018", "kyoto", "018-machiya-kyoto-street.jpg",
     "File:Ninen-zaka in Kyoto.jpg",
     "Ninenzaka Kyoto traditional street machiya", 800),
    ("019", "kyoto", "019-kabuki-stage-performance.jpg",
     "File:Kabuki performance in Ginza, Tokyo.jpg",
     "Kabuki theater performance stage", 1280),
    ("020", "kyoto", "020-kimono-textile-pattern.jpg",
     "File:Kimono of Ii Naosuke.jpg",
     "Japanese kimono textile pattern traditional", 800),

    # ── CH6: QUARKXPRESS / DTP (021–045) ──
    ("021", "quark", "021-muller-brockmann-beethoven.jpg",
     "File:Josef Müller-Brockmann. beethoven poster(1955).jpg",
     "Müller-Brockmann Beethoven poster 1955", 800),
    ("022", "quark", "022-muller-brockmann-der-film.jpg",
     "File:Josef Müller-Brockmann der Film.jpg",
     "Müller-Brockmann der Film poster", 800),
    ("023", "quark", "023-typographische-monatsblatter.jpg",
     "File:TM Typographische Monatsblätter 1961 01.jpg",
     "Typographische Monatsblätter 1961 cover", 800),
    ("024", "quark", "024-helvetica-specimen.svg",
     "File:Helvetica font.svg", "Helvetica font specimen", 0),
    ("025", "quark", "025-helvetica-neue-specimen.svg",
     "File:Typeface specimen Helvetica Neue.svg", "Helvetica Neue specimen", 0),
    ("026", "quark", "026-akzidenz-grotesk.svg",
     "File:Akzidenz-Grotesk variations.svg", "Akzidenz Grotesk typeface", 0),
    ("027", "quark", "027-univers-specimen.svg",
     "File:Univers Specimen.svg", "Univers typeface Frutiger", 0),
    ("028", "quark", "028-nasa-worm-logo.svg",
     "File:NASA Worm logo.svg", "NASA worm logo", 0),
    ("029", "quark", "029-nasa-worm-black.svg",
     "File:NASA Worm logo (black).svg", "NASA worm logo black", 0),
    ("030", "quark", "030-nasa-meatball-logo.svg",
     "File:NASA logo.svg", "NASA logo insignia meatball", 0),
    ("031", "quark", "031-shuttle-patch.svg",
     "File:Shuttle Patch.svg", "Space Shuttle program patch NASA", 0),
    ("033", "quark", "033-macintosh-128k.png",
     "File:Macintosh 128k transparency.png",
     "Macintosh 128k original Apple 1984", 800),
    ("034", "quark", "034-vignelli-subway-map.jpg",
     "File:1972 Massimo Vignelli Subway Map.jpg",
     "Vignelli 1972 New York subway map", 1200),
    ("035", "quark", "035-quarkxpress-font-manager.png",
     "File:Font Manager Palette in QuarkXPress 2024.png",
     "QuarkXPress 2024 font manager", 1200),
    ("036", "quark", "036-ibm-logo-paul-rand.svg",
     "File:IBM logo.svg", "IBM logo Paul Rand", 0),
    ("037", "quark", "037-ups-logo-paul-rand.svg",
     "File:UPS logo (1961-2003).svg", "UPS shield logo 1961 Paul Rand", 0),
    ("038", "quark", "038-abc-logo-paul-rand.svg",
     "File:American Broadcasting Company Logo.svg", "ABC American Broadcasting logo", 0),
    ("039", "quark", "039-bauhaus-dessau.jpg",
     "File:Bauhaus.JPG", "Bauhaus building Dessau architecture", 1280),
    ("040", "quark", "040-braun-sk4-dieter-rams.jpg",
     "File:Braun SK 4.jpg",
     "Braun SK4 Dieter Rams record player Schneewittchensarg", 1024),
    ("041", "quark", "041-apple-laserwriter.jpg",
     "File:Apple LaserWriter Pro 630.jpg",
     "Apple LaserWriter printer", 1024),
    ("042", "quark", "042-heidelberg-offset-press.jpg",
     "File:Heidelberg Speedmaster SM 52.jpg",
     "Heidelberg Speedmaster offset printing press", 1280),
    ("043", "quark", "043-futura-specimen.svg",
     "File:Futura Specimen.svg", "Futura typeface specimen Renner", 0),
    ("044", "quark", "044-neue-haas-grotesk.svg",
     "File:Neue Haas Grotesk Specimen.svg", "Neue Haas Grotesk Helvetica original", 0),
    ("045", "quark", "045-gill-sans-specimen.svg",
     "File:Gill Sans specimen sheet.svg", "Gill Sans typeface specimen Eric Gill", 0),

    # ── CH1: AI SYSTEMS (046–065) ──
    ("046", "fabrion", "046-industrial-robot-arm.jpg",
     "File:Automation of foundry with robot.jpg",
     "industrial robot arm factory automation", 1280),
    ("047", "fabrion", "047-fanuc-assembly-line.jpg",
     "File:FANUC Robot Assembly Line.jpg",
     "FANUC robot assembly line factory", 1280),
    ("048", "fabrion", "048-iot-sensor-board.jpg",
     "File:Intel Edison Board.jpg",
     "Intel Edison IoT sensor board", 1024),
    ("049", "fabrion", "049-smart-factory-automated.jpg",
     "File:Tesla auto bots.jpg",
     "Tesla factory automated robots manufacturing", 1280),
    ("050", "fabrion", "050-raspberry-pi-edge.jpg",
     "File:Raspberry Pi 4 Model B - Side.jpg",
     "Raspberry Pi 4 Model B computer", 1280),
    ("051", "fabrion", "051-cnc-precision-machining.jpg",
     "File:CNC Turning Center.jpg",
     "CNC turning center precision machining", 1280),
    ("052", "fabrion", "052-circuit-board-macro.jpg",
     "File:Pcb backlight.jpg",
     "printed circuit board PCB macro photography", 1280),
    ("053", "tdk", "053-mems-gyroscope.jpg",
     "File:MEMS Gyroscope.jpg",
     "MEMS gyroscope sensor micro", 1024),
    ("054", "tdk", "054-mems-accelerometer.jpg",
     "File:ADXL50 surface.jpg",
     "ADXL50 MEMS accelerometer chip surface", 1024),
    ("055", "tdk", "055-silicon-chip-3d.png",
     "File:Silicon chip 3d.png",
     "silicon chip semiconductor 3D rendering", 1024),
    ("056", "tdk", "056-wearable-fitness-sensor.jpg",
     "File:Fitness tracker.jpg",
     "fitness tracker wearable sensor band", 1024),
    ("057", "tdk", "057-cleanroom-semiconductor.jpg",
     "File:Cleanroom suit.jpg",
     "cleanroom semiconductor manufacturing suit", 800),
    ("058", "tdk", "058-tdk-logo.svg",
     "File:TDK logo.svg", "TDK corporation logo", 0),
    ("059", "ai-workflow", "059-neural-network.svg",
     "File:Artificial neural network.svg",
     "artificial neural network diagram", 0),
    ("060", "ai-workflow", "060-deep-learning-layers.png",
     "File:Colored neural network.svg",
     "neural network deep learning colored layers", 800),
    ("061", "ai-workflow", "061-transformer-architecture.png",
     "File:The-Transformer-model-architecture.png",
     "transformer model architecture attention", 800),
    ("062", "ai-workflow", "062-gradient-descent.svg",
     "File:Gradient descent.svg",
     "gradient descent optimization", 0),
    ("063", "ai-workflow", "063-gan-architecture.svg",
     "File:GAN.svg",
     "generative adversarial network GAN architecture", 0),
    ("064", "ai-workflow", "064-kernel-machine.png",
     "File:Kernel Machine.svg",
     "kernel machine support vector SVM", 1024),
    ("065", "ai-workflow", "065-attention-mechanism.png",
     "File:Attention Diagram.svg",
     "attention mechanism transformer diagram", 800),

    # ── CH2: AGENCY (066–085) ──
    ("066", "rakuten", "066-rakuten-logo.svg",
     "File:Rakuten Global Brand Logo.svg", "Rakuten logo brand", 0),
    ("067", "rakuten", "067-smartwatch-health.jpg",
     "File:Galaxy Watch Active 2, Pair.jpg",
     "Samsung Galaxy Watch Active smartwatch health", 1024),
    ("068", "rakuten", "068-nanzenji-zen-garden.jpg",
     "File:Nanzen-ji hojo garden.jpg",
     "Nanzenji temple hojo garden Kyoto zen", 1280),
    ("069", "rakuten", "069-kusatsu-onsen.jpg",
     "File:Kusatsu Onsen 01.jpg",
     "Kusatsu onsen hot spring Japan", 1280),
    ("070", "rakuten", "070-running-track-wellness.jpg",
     "File:Running track - Atletismo.jpg",
     "running track athletics sport wellness", 1280),
    ("071", "ogilvy", "071-audi-logo.svg",
     "File:Audi-Logo 2016.svg", "Audi rings logo 2016", 0),
    ("072", "ogilvy", "072-audi-etron-quattro.jpg",
     "File:Audi e-tron 55 quattro IMG 0174.jpg",
     "Audi e-tron quattro electric car", 1280),
    ("073", "ogilvy", "073-audi-virtual-cockpit.jpg",
     "File:2019 Audi A7 Sportback 55 TFSI (interior).jpg",
     "Audi A7 interior virtual cockpit dashboard", 1280),
    ("074", "ogilvy", "074-david-ogilvy-portrait.jpg",
     "File:David Ogilvy at his Chateau de Touffou.jpg",
     "David Ogilvy advertising portrait", 800),
    ("075", "ogilvy", "075-hud-display.jpg",
     "File:Head-up display in a BMW E60 5 Series.JPG",
     "head-up display HUD car windshield BMW", 1280),
    ("076", "ogilvy", "076-automotive-design-studio.jpg",
     "File:Automesse 2005 (DaimlerChrysler).jpg",
     "automotive design studio car showroom", 1280),
    ("077", "slalom", "077-unicorn-gundam-odaiba.jpg",
     "File:Unicorn Gundam Statue in Odaiba, Tokyo.jpg",
     "Unicorn Gundam statue Odaiba Tokyo", 1024),
    ("078", "slalom", "078-moving-gundam-yokohama.jpg",
     "File:Moving Gundam in Yokohama, 2021.jpg",
     "moving life-size Gundam Yokohama 2021", 800),
    ("079", "slalom", "079-gunpla-rx78-2.jpg",
     "File:Gunpla HG RX-78-2.jpg",
     "Gunpla model kit RX-78 Gundam", 800),
    ("080", "slalom", "080-vr-headset.jpg",
     "File:Reality Headset.jpg",
     "virtual reality VR headset metaverse", 1024),
    ("081", "slalom", "081-bandai-namco-logo.svg",
     "File:Bandai Namco Entertainment logo.svg", "Bandai Namco logo", 0),
    ("082", "slalom", "082-akihabara-neon.jpg",
     "File:Akihabara - panoramio.jpg",
     "Akihabara neon signs Tokyo night electric town", 1280),
    ("083", "slalom", "083-rx78-original-exhibit.jpg",
     "File:RX-78 at Gundam the Origin Exhibit.jpg",
     "RX-78 original Gundam exhibit", 800),
    ("084", "slalom", "084-shibuya-crossing-night.jpg",
     "File:Shibuya Night (Unsplash).jpg",
     "Shibuya crossing night Tokyo neon", 1280),
    ("085", "slalom", "085-shinjuku-skyline.jpg",
     "File:Skyscrapers of Shinjuku 2009 January.jpg",
     "Shinjuku skyline skyscrapers Tokyo", 1280),

    # ── CH3: AUDIO (086–105) ──
    ("086", "denon", "086-denon-turntable.jpg",
     "File:Denon DP-300F turntable.jpg",
     "Denon turntable record player audiophile", 1024),
    ("087", "denon", "087-vinyl-record-closeup.jpg",
     "File:Vinyl record LP 10inch.JPG",
     "vinyl record LP grooves closeup", 1024),
    ("088", "denon", "088-bw-speakers.jpg",
     "File:Bowers & Wilkins DM 604 S3.jpg",
     "Bowers Wilkins speakers hi-fi audiophile", 800),
    ("089", "denon", "089-vacuum-tube-kt88.jpg",
     "File:Kt88 tube.jpg",
     "KT88 vacuum tube amplifier valve", 800),
    ("090", "denon", "090-analog-vu-meters.jpg",
     "File:Analog VU Meter.jpg",
     "analog VU meter audio level", 1024),
    ("091", "denon", "091-sawtooth-synthesis.svg",
     "File:Synthesis sawtooth.svg", "sawtooth wave synthesis audio", 0),
    ("092", "denon", "092-revox-reel-to-reel.jpg",
     "File:Revox A77.jpg",
     "Revox A77 reel to reel tape recorder", 800),
    ("093", "denon", "093-sennheiser-hd600.jpg",
     "File:Sennheiser HD 600 Open-Back Audiophile Headphones.jpg",
     "Sennheiser HD 600 headphones audiophile", 1024),
    ("094", "denon", "094-frequency-bandwidth.svg",
     "File:Bandwidth.svg", "bandwidth frequency audio diagram", 0),
    ("095", "denon", "095-marantz-logo.svg",
     "File:Marantz logo.svg", "Marantz logo audio", 0),
    ("096", "miselu", "096-korg-midi-keyboard.jpg",
     "File:Korg microKEY-61 MIDI keyboard controller.jpg",
     "Korg microKEY MIDI keyboard controller", 1280),
    ("097", "miselu", "097-daw-ardour.png",
     "File:Ardour 6.9 Cue Page.png",
     "Ardour DAW digital audio workstation", 1280),
    ("098", "miselu", "098-modular-synth-moog.jpg",
     "File:Modular synthesizer - Moog and Buchla.jpg",
     "modular synthesizer Moog Buchla", 1280),
    ("099", "miselu", "099-ipad-mobile-music.png",
     "File:IPad Air 2.png",
     "iPad Air tablet Apple mobile", 800),
    ("100", "miselu", "100-bluetooth-logo.svg",
     "File:Bluetooth.svg", "Bluetooth logo wireless", 0),
    ("101", "miselu", "101-ces-convention.jpg",
     "File:Las Vegas Convention Center.jpg",
     "Las Vegas Convention Center CES", 1280),
    ("102", "miselu", "102-piano-keys.jpg",
     "File:Piano keys.JPG",
     "piano keys keyboard musical instrument", 1280),
    ("103", "miselu", "103-recording-studio.jpg",
     "File:Tonstudio.jpg",
     "recording studio mixing console professional", 1280),
    ("104", "miselu", "104-teensy-microcontroller.jpg",
     "File:Teensy 3.2.jpg",
     "Teensy microcontroller board", 1024),
    ("105", "miselu", "105-midi-din5-connectors.jpg",
     "File:MIDI IN, THRU, and OUT on the rear panel of a Yamaha QY100.jpg",
     "MIDI DIN connector Yamaha", 1024),

    # ── CH4: MUSIC & EVENTS (106–130) ──
    ("106", "beatport", "106-pioneer-cdj-djm.jpg",
     "File:Pioneer CDJ-2000 and DJM-900nexus.jpg",
     "Pioneer CDJ 2000 DJM mixer DJ setup", 1280),
    ("107", "beatport", "107-turntables-mixer.jpg",
     "File:Turntables and mixer.jpg",
     "DJ turntables mixer vinyl", 1280),
    ("108", "beatport", "108-vinyl-record-store.jpg",
     "File:Vinyl Record Store.jpg",
     "vinyl record store crate digging music", 1280),
    ("109", "beatport", "109-dj-booth-live.jpg",
     "File:DJ setup - in action.jpg",
     "DJ booth nightclub setup live performance", 1280),
    ("110", "beatport", "110-waveforms.svg",
     "File:Waveforms.svg", "waveforms sine square audio", 0),
    ("111", "beatport", "111-technics-sl1200.jpg",
     "File:Technics SL-1200MK2.jpg",
     "Technics SL-1200 turntable DJ", 1024),
    ("112", "robot-heart", "112-burning-man-temple.jpg",
     "File:Burning Man 2013 Temple of Whollyness (9660575463).jpg",
     "Burning Man temple art installation", 1280),
    ("113", "robot-heart", "113-black-rock-city-aerial.jpg",
     "File:Black Rock City from the air in 2014.jpg",
     "Black Rock City aerial Burning Man desert", 1280),
    ("114", "robot-heart", "114-mutant-vehicle.jpg",
     "File:BM Mutant Vehicles - Playa Chicken.jpg",
     "Burning Man mutant vehicle art car playa", 1280),
    ("115", "robot-heart", "115-burning-man-desert.jpg",
     "File:Burning Man 2012 Caravansary (8080867244).jpg",
     "Burning Man desert playa caravansary", 1280),
    ("116", "robot-heart", "116-the-man-burns.jpg",
     "File:The Man Burns.jpg",
     "the Man burns Burning Man fire", 800),
    ("117", "robot-heart", "117-concert-speakers.jpg",
     "File:ConcertSpeakers.jpg",
     "concert speakers sound system large", 1024),
    ("118", "techcrunch", "118-techcrunch-disrupt-sf.jpg",
     "File:TechCrunch Disrupt SF 2012.jpg",
     "TechCrunch Disrupt stage conference", 1280),
    ("119", "techcrunch", "119-disrupt-stage-2013.jpg",
     "File:TechCrunch SF 2013 StageBG.jpg",
     "TechCrunch Disrupt 2013 stage startup", 1280),
    ("120", "techcrunch", "120-san-francisco-skyline.jpg",
     "File:San Francisco from the Marin Headlands in March 2019.jpg",
     "San Francisco skyline Golden Gate panorama", 1280),
    ("121", "techcrunch", "121-hackathon-coding.jpg",
     "File:HackathonPeople.jpg",
     "hackathon people coding startup", 1280),
    ("122", "techcrunch", "122-silicon-valley-sign.jpg",
     "File:Silicon Valley road sign, 2008.jpg",
     "Silicon Valley road sign California", 1280),
    ("123", "festivals", "123-coachella-stage.jpg",
     "File:Coachella 2014 - Day 3 (14155694405).jpg",
     "Coachella festival main stage crowd", 1280),
    ("124", "festivals", "124-festival-crowd-aerial.jpg",
     "File:Roskilde Festival - Orange Stage - Bruce Springsteen.jpg",
     "music festival crowd aerial stage orange", 1280),
    ("125", "festivals", "125-tomorrowland-mainstage.jpg",
     "File:Tomorrowland 2013.jpg",
     "Tomorrowland 2013 main stage electronic", 1280),
    ("126", "festivals", "126-stage-lighting-led.jpg",
     "File:Rock concert stage lights.jpg",
     "rock concert stage lights LED lighting", 1280),
    ("127", "festivals", "127-fuji-rock-festival.jpg",
     "File:Fuji Rock Festival 2011.jpg",
     "Fuji Rock Festival Japan music outdoor", 1280),
    ("128", "festivals", "128-projection-mapping.jpg",
     "File:Video mapping on Bratislava Castle, 2012.jpg",
     "video projection mapping castle building art", 1280),
    ("129", "festivals", "129-coachella-grounds.jpg",
     "File:Coachella 2012 - Day 1 (7146261089).jpg",
     "Coachella festival grounds desert ferris wheel", 1280),
    ("130", "festivals", "130-laser-show-concert.jpg",
     "File:Laser show at a concert.jpg",
     "laser show concert lights performance", 1280),
]


def main():
    print("╔══════════════════════════════════════════════════════════╗")
    print("║  Keisuke Shingu · Portfolio Image Library v5 (Python)   ║")
    print("║  Smart search fallback for missing filenames            ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print()

    folders = set(img[1] for img in IMAGES)
    for folder in folders:
        os.makedirs(os.path.join(BASE, folder), exist_ok=True)

    success = 0
    failed = []
    current_folder = ""

    for img_id, folder, filename, exact_title, search_terms, width in IMAGES:
        if folder != current_folder:
            if current_folder:
                print()
            chapter_names = {
                "kyoto": "Ch5 — Kyoto Archive",
                "quark": "Ch6 — QuarkXPress / DTP",
                "fabrion": "Ch1 — Fabrion", "tdk": "Ch1 — TDK SensEI",
                "ai-workflow": "Ch1 — AI Workflow",
                "rakuten": "Ch2 — Rakuten Fit", "ogilvy": "Ch2 — Ogilvy / Audi",
                "slalom": "Ch2 — Gundam Metaverse",
                "denon": "Ch3 — Denon / Marantz", "miselu": "Ch3 — Miselu C.24",
                "beatport": "Ch4 — Beatport / NI", "robot-heart": "Ch4 — Robot Heart",
                "techcrunch": "Ch4 — TechCrunch", "festivals": "Ch4 — Festivals",
            }
            print(f"▸ {chapter_names.get(folder, folder)}")
            current_folder = folder

        out_path = os.path.join(BASE, folder, filename)

        # Skip valid cached files
        if is_valid_cached(out_path):
            print(f"  ✓ {filename} (cached)")
            success += 1
            continue

        # Step 1: Try exact title
        url = get_image_url_by_title(exact_title, width)

        if url:
            if download_file(url, out_path):
                print(f"  ✓ {filename}")
                success += 1
                time.sleep(0.05)
                continue

        # Step 2: Fallback — search Wikimedia Commons
        found_title, url = search_and_get_url(search_terms, width)
        if url:
            if download_file(url, out_path):
                print(f"  ✓ {filename} (found: {found_title})")
                success += 1
                time.sleep(0.05)
                continue

        print(f"  ✗ {filename}")
        failed.append(filename)
        time.sleep(0.05)

    # Summary
    print()
    total = len(IMAGES)
    print("═" * 58)
    print(f"  Total: {total}  |  Success: {success}  |  Failed: {len(failed)}")
    print("═" * 58)

    if failed:
        print("\nFailed images:")
        for f in failed:
            print(f"  ✗ {f}")
    else:
        print("\n✓ All images downloaded successfully!")
        print("  Open image-library.html in your browser.")


if __name__ == "__main__":
    main()
