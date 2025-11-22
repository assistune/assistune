<!DOCTYPE html>
<html lang="tr" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assistune | Yapay Zeka Otomasyon Ajansı</title>
    <meta name="description" content="İşletmenizi yapay zeka ile otopilota alın. Mail, Chatbot ve Sesli Ajan çözümleri.">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Tailwind CSS (CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Tailwind Ayarları -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            cyan: '#00FFCC',
                            dark: '#050505',
                            card: '#0F1115',
                            text: '#F0F6F6',
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        brand: ['Goldman', 'cursive'],
                    },
                    animation: {
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }
                }
            }
        }
    </script>

    <!-- Harici CSS Dosyası -->
    <link rel="stylesheet" href="style.css">
</head>
<body class="antialiased text-brand-text bg-brand-dark">

    <!-- Canlı Arka Plan -->
    <div class="ambient-light">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
    </div>

    <!-- Navigasyon -->
    <nav class="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-black/80 backdrop-blur-lg transition-all duration-300" id="mainNav">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse group">
                <span class="self-center text-3xl font-brand text-white tracking-wide group-hover:scale-105 transition-transform">
                    assis<span class="text-brand-cyan">t</span>une
                </span>
            </a>
            
            <!-- Mobil Menü Butonu ve CTA -->
            <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <a href="#iletisim" class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 text-black focus:ring-4 focus:outline-none focus:ring-lime-200">
                    <span class="relative px-6 py-2.5 transition-all ease-in duration-75 bg-brand-cyan rounded-md group-hover:bg-opacity-0 font-bold tracking-wide">
                        BİZE ULAŞIN
                    </span>
                </a>
                <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100/10 focus:outline-none focus:ring-2 focus:ring-brand-cyan" aria-controls="navbar-sticky" aria-expanded="false">
                    <span class="sr-only">Menüyü aç</span>
                    <i class="fa-solid fa-bars text-2xl text-white"></i>
                </button>
            </div>

            <!-- Menü Linkleri -->
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-white/10 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-black/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none">
                    <li>
                        <a href="#hizmetler" class="nav-link block py-2 px-3 text-white hover:text-brand-cyan transition-colors rounded md:bg-transparent">Hizmetler</a>
                    </li>
                    <li>
                        <a href="#nasil" class="nav-link block py-2 px-3 text-white hover:text-brand-cyan transition-colors rounded md:bg-transparent">Nasıl Çalışır?</a>
                    </li>
                    <li>
                        <a href="#iletisim" class="nav-link block py-2 px-3 text-white hover:text-brand-cyan transition-colors rounded md:bg-transparent">İletişim</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Bölümü -->
    <section class="relative min-h-screen flex items-center justify-center px-4 text-center pt-20">
        <div class="max-w-4xl mx-auto z-10">
            <div class="inline-flex items-center justify-center px-4 py-1 mb-8 text-xs font-medium text-brand-cyan bg-brand-cyan/10 rounded-full border border-brand-cyan/20 animate-pulse-slow cursor-default hover:bg-brand-cyan/20 transition-colors">
                <span class="w-2 h-2 me-2 bg-brand-cyan rounded-full"></span>
                Geleceğin İşletim Sistemi
            </div>
            <h1 class="mb-6 text-5xl md:text-7xl font-brand tracking-tight leading-none text-white">
                Biz Sisteminizi Kuralım,<br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white text-glow">Siz Sadece İşinizi Yapın.</span>
            </h1>
            <p class="mb-8 text-lg font-light text-gray-300 lg:text-xl sm:px-16 xl:px-48">
                Mail otomasyonu, chatbotlar ve sesli ajanlarla işletmenizi 7/24 çalışan bir makineye dönüştürüyoruz.
            </p>
            <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <a href="#iletisim" class="inline-flex justify-center items-center py-3 px-8 text-base font-bold text-black rounded-lg bg-brand-cyan hover:bg-cyan-400 focus:ring-4 focus:ring-cyan-300 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,255,204,0.4)]">
                    Hemen Başlayın
                    <i class="fa-solid fa-arrow-right ml-2"></i>
                </a>
                <a href="#hizmetler" class="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-white rounded-lg border border-white/20 hover:bg-white/10 hover:border-brand-cyan/50 transition-all">
                    Hizmetleri Keşfet
                </a>
            </div>
        </div>
    </section>

    <!-- Hizmetler Bölümü -->
    <section id="hizmetler" class="py-24 relative z-10">
        <div class="max-w-screen-xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-brand mb-4 text-white">Neler Yapıyoruz?</h2>
                <p class="text-gray-400 max-w-2xl mx-auto">İşletmenizin operasyonel yükünü hafifleten 3 ana teknoloji.</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Kart 1 -->
                <div class="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300">
                    <div class="w-14 h-14 bg-brand-cyan/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-cyan/20 transition-colors">
                        <i class="fa-solid fa-robot text-2xl text-brand-cyan"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3 font-brand text-white">AI Chatbot</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">Web sitenize gelen ziyaretçileri karşılayan, sorularını yanıtlayan ve satışa dönüştüren 7/24 aktif dijital asistanlar.</p>
                </div>

                <!-- Kart 2 -->
                <div class="glass-card p-8 rounded-2xl group border-brand-cyan/30 shadow-[0_0_30px_rgba(0,255,204,0.05)] hover:-translate-y-2 transition-all duration-300 relative">
                    <div class="absolute top-0 right-0 px-3 py-1 bg-brand-cyan text-black text-xs font-bold rounded-bl-lg rounded-tr-lg">POPÜLER</div>
                    <div class="w-14 h-14 bg-brand-cyan/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-cyan/20 transition-colors">
                        <i class="fa-solid fa-microphone-lines text-2xl text-brand-cyan"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3 font-brand text-brand-cyan">Sesli Ajanlar</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">Müşterilerinizle telefon üzerinden doğal bir dille konuşan, randevu alan ve teyit eden yapay zeka ses teknolojileri.</p>
                </div>

                <!-- Kart 3 -->
                <div class="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300">
                    <div class="w-14 h-14 bg-brand-cyan/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-cyan/20 transition-colors">
                        <i class="fa-solid fa-envelope-open-text text-2xl text-brand-cyan"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3 font-brand text-white">Mail Otomasyonu</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">Potansiyel müşterilerinizi (lead) ısıtan, takip eden ve satış hunisinde ilerleten akıllı e-posta zincirleri.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Nasıl Çalışır? -->
    <section id="nasil" class="py-24 bg-black/30 border-y border-white/5 relative z-10 backdrop-blur-sm">
        <div class="max-w-screen-xl mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-3xl md:text-4xl font-brand mb-6 leading-tight text-white">
                        Karmaşık Süreçleri <br>
                        <span class="text-brand-cyan">Basitleştiriyoruz.</span>
                    </h2>
                    <div class="space-y-8">
                        <div class="flex gap-4 group">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold font-brand text-brand-cyan group-hover:bg-brand-cyan group-hover:text-black transition-colors">1</div>
                            <div>
                                <h4 class="text-lg font-bold text-white mb-1">Analiz</h4>
                                <p class="text-gray-400 text-sm">İşletmenizin "zaman yiyen" rutinlerini tespit ediyoruz.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 group">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold font-brand text-brand-cyan group-hover:bg-brand-cyan group-hover:text-black transition-colors">2</div>
                            <div>
                                <h4 class="text-lg font-bold text-white mb-1">Kurulum</h4>
                                <p class="text-gray-400 text-sm">Size özel yapay zeka ajanlarını kodluyor ve entegre ediyoruz.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 group">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold font-brand text-brand-cyan group-hover:bg-brand-cyan group-hover:text-black transition-colors">3</div>
                            <div>
                                <h4 class="text-lg font-bold text-white mb-1">Otopilot</h4>
                                <p class="text-gray-400 text-sm">Sistem çalışmaya başlıyor. Siz raporları izleyip işinize odaklanıyorsunuz.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative h-96 glass-card rounded-2xl flex items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-purple-900/20"></div>
                    <div class="text-center z-10 p-6">
                        <div class="text-6xl mb-4 animate-bounce">🚀</div>
                        <h3 class="text-2xl font-brand text-white">Otomasyona Geçin</h3>
                        <p class="text-brand-cyan mt-2 font-mono text-sm typing-effect">System Status: Online</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer / İletişim -->
    <footer id="iletisim" class="pt-24 pb-10 border-t border-white/10 bg-black relative z-10">
        <div class="max-w-screen-xl mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-brand text-white mb-4">Bize Ulaşın</h2>
                <p class="text-gray-400 max-w-xl mx-auto">Formu doldurun, yapay zeka asistanlarımız veya ekibimiz en kısa sürede size dönüş yapsın.</p>
            </div>

            <div class="grid md:grid-cols-2 gap-12 items-start mb-16">
                <!-- İletişim Bilgileri -->
                <div class="space-y-6">
                    <div class="glass-card p-8 rounded-2xl">
                        <h3 class="text-2xl font-brand text-white mb-6">İletişim Kanalları</h3>
                        <a href="mailto:info@assistune.com" class="flex items-center gap-4 text-gray-300 hover:text-brand-cyan transition-colors mb-4">
                            <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-cyan">
                                <i class="fa-regular fa-envelope"></i>
                            </div>
                            info@assistune.com
                        </a>
                        <a href="https://instagram.com/assistune" target="_blank" class="flex items-center gap-4 text-gray-300 hover:text-brand-cyan transition-colors">
                            <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-cyan">
                                <i class="fa-brands fa-instagram"></i>
                            </div>
                            @assistune
                        </a>
                    </div>
                    <div class="p-8 rounded-2xl border border-brand-cyan/20 bg-brand-cyan/5 relative overflow-hidden">
                        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-cyan/20 rounded-full blur-2xl"></div>
                        <h4 class="text-xl font-bold text-white mb-2">Hazır mısınız?</h4>
                        <p class="text-sm text-gray-400">"Biz sisteminizi kuralım, siz sadece işinizi yapın."</p>
                    </div>
                </div>

                <!-- İletişim Formu -->
                <div class="glass-card p-8 rounded-2xl border-t-4 border-t-brand-cyan">
                    <form id="contactForm" class="space-y-6">
                        <div>
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-300">Adınız Soyadınız</label>
                            <input type="text" id="name" name="name" class="bg-black/50 border border-gray-700 text-white text-sm rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block w-full p-3 placeholder-gray-600 transition-colors" placeholder="Ad Soyad" required>
                        </div>
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-300">E-posta Adresiniz</label>
                            <input type="email" id="email" name="email" class="bg-black/50 border border-gray-700 text-white text-sm rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block w-full p-3 placeholder-gray-600 transition-colors" placeholder="ornek@sirket.com" required>
                        </div>
                        <div>
                            <label for="phone" class="block mb-2 text-sm font-medium text-gray-300">Telefon Numaranız</label>
                            <input type="tel" id="phone" name="phone" class="bg-black/50 border border-gray-700 text-white text-sm rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block w-full p-3 placeholder-gray-600 transition-colors" placeholder="0555 555 55 55" required>
                        </div>
                        <button type="submit" id="submitBtn" class="w-full text-black bg-brand-cyan hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-bold rounded-lg text-sm px-5 py-3.5 text-center transition-all transform hover:scale-[1.02]">
                            BİZE ULAŞIN
                        </button>
                        <p id="formStatus" class="text-center text-sm mt-3 hidden"></p>
                    </form>
                </div>
            </div>

            <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-center">
                <span class="text-2xl font-brand text-white tracking-wide mb-4 md:mb-0">
                    assis<span class="text-brand-cyan">t</span>une
                </span>
                <span class="text-gray-600 text-sm">© 2024 Assistune AI Automation.</span>
            </div>
        </div>
    </footer>

    <!-- Harici JavaScript Dosyası -->
    <script src="script.js" defer></script>
</body>
</html>