export interface GamesType {
  title: string;
  color: string;
  description: string;
  imgSrc: any;
}

export const games = [
  {
    title: 'Chess',
    color: '#FF6B6B',
    description:
      'Klasik strateji oyunu. İki oyuncu sırayla taşlarını hareket ettirerek rakibin şahını mat etmeye çalışır.',
    imgSrc: require('../Assets/Images/chess.png'),
  },
  {
    title: 'Roulette',
    color: '#AAF0D1',
    description:
      'Bir çark ve top üzerinden oynanan şans oyunu. Oyuncular sayı, renk veya aralık üzerine bahis yapar. Topun durduğu yer sonucu belirler.',
    imgSrc: require('../Assets/Images/roulette.png'),
  },
  {
    title: 'BlackJack',
    color: '#F2CCA3',
    description:
      'Amaç 21’e en yakın el değerine ulaşmak. Oyuncular ve krupiye kart çeker, 21’i geçmeden en yüksek sayıya ulaşmaya çalışır.',
    imgSrc: require('../Assets/Images/blackjack.png'),
  },
  {
    title: 'Card Memoization',
    color: '#4D96FF',
    description:
      "Kullanıcı kapalı kartları çevirerek eşleşenleri bulmaya çalışır. Hafızayı test eder. Genellikle 4x4, 6x6 gibi kart grid'leri ile oynanır. ",
    imgSrc: require('../Assets/Images/cardmemo.png'),
  },
  {
    title: 'Scratch Card',
    color: '#00C9A7',
    description:
      'Kullanıcı bir yüzeyi “kazıyarak” altındaki ödülü görür. Şans oyunu türüdür. Görsel etkileşim ve dokunmatik kazıma efekti ile eğlencelidir.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
  {
    title: 'Whack-a-Mole',
    color: '#FFC75F',
    description:
      'Belirli aralıklarla çıkan köstebeklere hızlıca tıklama oyunu. Zaman ve refleks odaklıdır, hız arttıkça zorluk da artar.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
  {
    title: 'Dice Roller',
    color: '#D65DB1',
    description:
      'Zar atılarak rastgele sayılar elde edilir. Şansa dayalı küçük oyunlarda temel bileşen olarak kullanılabilir.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
  {
    title: 'Math Quiz',
    color: '#4D96FF',
    description:
      'Toplama, çıkarma gibi basit işlemler üzerinden rastgele sorularla zihinsel işlem yapma oyunu.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
  {
    title: 'Tap the Color',
    color: '#C7F464',
    description:
      'Ekranda anlık değişen renkleri doğru zamanda tıklama. Dikkat ve refleks gerektirir.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
  {
    title: 'Word Unscramble',
    color: '#B39CD0',
    description:
      'Karışık harflerden doğru kelimeyi bulma oyunu. Kelime dağarcığını test eder.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
  {
    title: 'Rock Paper Scissors',
    color: '#85D87A',
    description:
      'Taş, Kağıt, Makas klasik oyunu. Oyuncu seçer, sistem rastgele seçer, kazanan belirlenir.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
  {
    title: 'Number Guessing Game',
    color: '#C34A36',
    description:
      'Sistem 1-100 arasında bir sayı tutar. Oyuncu tahmin eder, sistem yönlendirir: Yukarı ya da Aşağı.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
  {
    title: 'Balloon Popper',
    color: '#A28089',
    description:
      'Ekranda çıkan balonları zamanında patlatma. Hızlı refleks ve dikkat gerektirir.',
    imgSrc: require('../Assets/Images/comingsoon.png'),
  },
];
