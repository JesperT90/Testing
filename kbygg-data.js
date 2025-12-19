/**
 * K-Bygg Anläggningar och Konkurrenter
 * Data för strategisk analys och visualisering
 */

// K-Bygg's alla anläggningar med koordinater
const KBYGG_LOCATIONS = [
    // Stockholm & Mälardalen
    { name: 'K-Bygg Täby', address: 'Mätslingan 1, 187 66 Täby', lat: 59.4439, lng: 18.0658, region: 'Stockholm' },
    { name: 'K-Bygg Södertälje', address: 'Klastorpsvägen 1, 152 42 Södertälje', lat: 59.1955, lng: 17.6253, region: 'Stockholm' },
    { name: 'K-Bygg Järfälla', address: 'Skarprättarvägen 26, 176 77 Järfälla', lat: 59.4144, lng: 17.8617, region: 'Stockholm' },
    { name: 'K-Bygg Järfälla - hubb', address: 'Skarprättarvägen 26, 177 77 Järfälla', lat: 59.4144, lng: 17.8617, region: 'Stockholm' },
    { name: 'K-Bygg Uppsala', address: 'Edsbrogatan 5, 752 28 Uppsala', lat: 59.8586, lng: 17.6389, region: 'Uppsala' },
    { name: 'K-Bygg Västberga', address: 'Västberga Allé 50, 126 30 Hägersten', lat: 59.2997, lng: 18.0086, region: 'Stockholm' },
    { name: 'K-Bygg Färingsö Trä', address: 'Färentunavägen 65, 179 75 Skå', lat: 59.3644, lng: 17.5489, region: 'Stockholm' },
    { name: 'K-Bygg Vallentuna', address: 'Cederdalsvägen 2-4, 186 40 Vallentuna', lat: 59.5339, lng: 18.0775, region: 'Stockholm' },
    { name: 'K-Bygg Vaxholm', address: 'Eriksövägen 4, 185 33 Vaxholm', lat: 59.4019, lng: 18.3544, region: 'Stockholm' },
    { name: 'K-Bygg Tullinge', address: 'Bernströmsvägen 2, 146 38 Tullinge', lat: 59.2000, lng: 17.9094, region: 'Stockholm' },
    { name: 'K-Bygg Sorunda', address: 'Grönlundsvägen 1, 148 96 Sorunda', lat: 59.0369, lng: 17.8622, region: 'Stockholm' },
    
    // Östergötland
    { name: 'K-BYGG Linköping', address: 'Gillbergagatan 17, 582 73 Linköping', lat: 58.4108, lng: 15.6214, region: 'Östergötland' },
    { name: 'K-BYGG Mjölby', address: 'Linköpingsvägen 3, 595 50 Mjölby', lat: 58.3250, lng: 15.1278, region: 'Östergötland' },
    { name: 'K-BYGG Motala', address: 'Björnvägen 1, 591 52 Motala', lat: 58.5372, lng: 15.0356, region: 'Östergötland' },
    { name: 'K-BYGG Vadstena', address: 'Industrivägen 3, 592 41 Vadstena', lat: 58.4497, lng: 14.8903, region: 'Östergötland' },
    { name: 'K-BYGG Åtvidaberg', address: 'Fågelsångens Industriområde, 597 53 Åtvidaberg', lat: 58.2000, lng: 16.0000, region: 'Östergötland' },
    { name: 'K-BYGG Rimforsa', address: 'Industrivägen 6, 590 44 Rimforsa', lat: 58.1408, lng: 15.6408, region: 'Östergötland' },
    { name: 'K-BYGG Norrköping', address: 'Returgatan 3, 602 38 Norrköping', lat: 58.5878, lng: 16.1928, region: 'Östergötland' },
    { name: 'K-Bygg Söderköping', address: 'Ågatan 4, 614 34 Söderköping', lat: 58.4836, lng: 16.3228, region: 'Östergötland' },
    
    // Södermanland
    { name: 'K-Bygg Katrineholm', address: 'Starrvägen 10A, 641 49 Katrineholm', lat: 59.0000, lng: 16.2078, region: 'Södermanland' },
    { name: 'K-Bygg Flen', address: 'Kungsvägen 37, 642 33 Flen', lat: 59.0569, lng: 16.5869, region: 'Södermanland' },
    { name: 'K-Bygg Vingåker', address: 'Vannalavägen 10, 643 22 Vingåker', lat: 59.0467, lng: 15.8700, region: 'Södermanland' },
    { name: 'K-Bygg Eskilstuna', address: 'Västerleden 34, 633 47 Eskilstuna', lat: 59.3711, lng: 16.5089, region: 'Södermanland' },
    
    // Närke
    { name: 'K-Bygg Västerås', address: 'Glasvingegatan 7, 721 34 Västerås', lat: 59.6099, lng: 16.5448, region: 'Västmanland' },
    { name: 'K-Bygg Örebro', address: 'Kundvägen 5, 702 36 Örebro', lat: 59.2753, lng: 15.2134, region: 'Närke' },
    { name: 'K-Bygg Frövi', address: 'Pikaboda 140, 718 91 Frövi', lat: 59.5717, lng: 15.5925, region: 'Närke' },
    
    // Jämtland & Härjedalen
    { name: 'K-Bygg Östersund', address: 'Hagvägen 12, 831 48 Östersund', lat: 63.1792, lng: 14.6357, region: 'Jämtland' },
    { name: 'K-Bygg Funäsdalen', address: 'Rörosvägen 80, 840 95 Funäsdalen', lat: 62.5500, lng: 12.5333, region: 'Härjedalen' },
    { name: 'K-Bygg Undersåker', address: 'Byvägen 141, 837 96 Undersåker', lat: 63.3500, lng: 13.0833, region: 'Jämtland' },
    { name: 'K-Bygg Strömsund', address: 'Harbäcken 315, 833 92 Strömsund', lat: 63.8500, lng: 15.5500, region: 'Jämtland' },
    { name: 'K-Bygg Föllinge', address: 'Eidevägen 1, 835 61 Föllinge', lat: 63.2833, lng: 15.0167, region: 'Jämtland' },
    { name: 'GP Östersund', address: 'Odenskogsvägen 31-33, 831 03 Östersund', lat: 63.1792, lng: 14.6357, region: 'Jämtland' },
    { name: 'GP Lås i Östersund', address: 'Odenskogsvägen 31-33, 831 03 Östersund', lat: 63.1792, lng: 14.6357, region: 'Jämtland' },
    
    // Ångermanland & Medelpad
    { name: 'K-Bygg Sollefteå', address: 'Övergårdsvägen 17, 881 41 Sollefteå', lat: 63.1667, lng: 17.2667, region: 'Ångermanland' },
    { name: 'K-Bygg Kramfors', address: 'Aspåsvägen 14, 872 43 Kramfors', lat: 62.9333, lng: 17.7833, region: 'Ångermanland' },
    { name: 'K-Bygg Härnösand', address: 'Saltviksvägen 13, 871 54 Härnösand', lat: 62.6322, lng: 17.9378, region: 'Ångermanland' },
    { name: 'K-Bygg Sundsvall', address: 'Murarvägen 8, 853 50 Sundsvall', lat: 62.3908, lng: 17.3069, region: 'Medelpad' },
    { name: 'Harjus AB', address: 'Nygatan 4, 891 21 Örnsköldsvik', lat: 63.2909, lng: 18.7153, region: 'Ångermanland' },
    { name: 'Övik Låsteknik AB', address: 'Maskingatan 2, 891 38 Örnsköldsvik', lat: 63.2909, lng: 18.7153, region: 'Ångermanland' },
    
    // Hälsingland
    { name: 'K-Bygg Bollnäs', address: 'Industrigatan 14, 821 41 Bollnäs', lat: 61.3478, lng: 16.3939, region: 'Hälsingland' },
    { name: 'K-Bygg Söderhamn', address: 'INA 2110, 826 91 Söderhamn', lat: 61.3039, lng: 17.0661, region: 'Hälsingland' },
    
    // Västerbotten & Lappland
    { name: 'K-Bygg Vilhelmina', address: 'Sälggatan 2, 912 32 Vilhelmina', lat: 64.6167, lng: 16.6500, region: 'Lappland' },
    { name: 'K-Bygg Storuman', address: 'Blå Vägen 255, 923 32 Storuman', lat: 65.0833, lng: 17.1167, region: 'Lappland' },
    { name: 'K-Bygg Norsjö', address: 'Storgatan 73, 935 32 Norsjö', lat: 65.1167, lng: 19.4833, region: 'Västerbotten' },
    { name: 'K-Bygg Umeå', address: 'Spårvägen 10, 901 22 Umeå', lat: 63.8258, lng: 20.2630, region: 'Västerbotten' },
    
    // Västra Götaland
    { name: 'K-Bygg Backa', address: 'Exportgatan 23, 442 46 Hisings Backa', lat: 57.7378, lng: 11.9778, region: 'Västra Götaland' },
    { name: 'K-Bygg Kungälv', address: 'Byggmästargatan 3, 442 34 Kungälv', lat: 57.8706, lng: 11.9800, region: 'Västra Götaland' },
    { name: 'K-Bygg Älvängen', address: 'Sventorpsvägen 17, 446 38 Älvängen', lat: 57.9500, lng: 12.1000, region: 'Västra Götaland' },
    { name: 'K-Bygg Sörred', address: 'Kärrlyckegatan 26, 418 78 Göteborg', lat: 57.6883, lng: 11.9536, region: 'Västra Götaland' },
    { name: 'K-Bygg Högsbo', address: 'August Barks gata 24, 421 32 Västra Frölunda', lat: 57.6522, lng: 11.9200, region: 'Västra Götaland' },
    { name: 'K-Bygg Mölndal - hubb', address: 'Jolengatan, 431 49 Mölndal', lat: 57.6553, lng: 12.0133, region: 'Västra Götaland' },
    { name: 'K-Bygg Liared', address: 'Liared, 523 91 Ulricehamn', lat: 57.7928, lng: 13.4200, region: 'Västra Götaland' },
    { name: 'K-Bygg Ulricehamn', address: 'Karlsnäsvägen 16, 523 37 Ulricehamn', lat: 57.7928, lng: 13.4200, region: 'Västra Götaland' },
    { name: 'K-Bygg Mellerud', address: 'Sapphultsgatan 12, 464 34 Mellerud', lat: 58.7000, lng: 12.4500, region: 'Västra Götaland' },
    
    // Halland
    { name: 'K-Bygg Halmstad', address: 'Kundvägen 20, 30241 Halmstad', lat: 56.6745, lng: 12.8567, region: 'Halland' },
    
    // Småland
    { name: 'K-BYGG Huskvarna', address: 'Larssons Väg 3, 561 91 Huskvarna', lat: 57.7856, lng: 14.3000, region: 'Småland' },
    { name: 'K-Bygg Jönköping', address: 'Mogölsvägen 1, 555 93 Jönköping', lat: 57.7826, lng: 14.1618, region: 'Småland' },
    { name: 'K-Bygg Töreboda', address: 'Skövdevägen 27, 545 31 Töreboda', lat: 58.7078, lng: 14.1264, region: 'Småland' },
    { name: 'K-Bygg Vetlanda', address: 'Industrigatan 18, 574 38 Vetlanda', lat: 57.4289, lng: 15.0722, region: 'Småland' },
    
    // Centralt
    { name: 'Kesko centrallager Pilängen', address: 'Pikullagatan 20, 702 27 Örebro', lat: 59.2753, lng: 15.2134, region: 'Närke' },
    { name: 'Kesko AB Huvudkontor', address: 'Borgarfjordsgatan 18, 164 40 Kista', lat: 59.4036, lng: 17.9494, region: 'Stockholm' }
];

// Konkurrerande aktörer (exempel - lägg till fler vid behov)
const COMPETITORS = {
    'Beijer': { color: '#FF6B6B', type: 'Bygghandel' },
    'Optimera XL-BYGG': { color: '#4ECDC4', type: 'Bygghandel' },
    'Karl Hedin': { color: '#95E1D3', type: 'Bygghandel' },
    'Derome': { color: '#F38181', type: 'Bygghandel' },
    'Byggmax': { color: '#AA96DA', type: 'Byggvaruhus' },
    'Bauhaus': { color: '#FCBAD3', type: 'Byggvaruhus' },
    'Hornbach': { color: '#FF8B94', type: 'Byggvaruhus' },
    'K-rauta': { color: '#FED766', type: 'Bygghandel' }
};

// Exportera för användning i huvudappen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        KBYGG_LOCATIONS,
        COMPETITORS
    };
}
