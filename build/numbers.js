import { WORDS } from "./words.js";


export function getDateNumber() {
    const d = new Date();
    const year = d.getFullYear().toString();
    let month = (d.getMonth() + 1).toString();
    let date = d.getDate().toString();
    if (month.length === 1) {
        month = '0' + month;
    }
    return parseInt(`${year}${month}${date}`, 10);
}

export function getWordNumber(dateNumber) {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        return Math.floor(Math.random() * WORDS.length);
    } else {
        const pos = POSITIONS[dateNumber % POSITIONS.length];
        if (pos < WORDS.length) {
            return pos;
        }
        console.log(`Can't find position ${pos}, only have #{ WORDS.length } words`);
        // this cycles through the list sort of randomly but not really
        return ((dateNumber * 2 + 1) * 1793) % WORDS.length;
    }
}

// Modifies both arguments
export function perturb(scores, changes) {
    const i = Math.floor(Math.random() * scores.length);
    const oldVal = scores[i] + 3;
    scores[i] = (Math.random() < 0.5 ? oldVal - 1 : oldVal + 1) % 3;
    changes.push([i, oldVal - 3, scores[i]]);
}

export const POSITIONS = [734, 1006, 1676, 1853, 1917, 1100, 816,
    2072, 1950, 1936, 2176, 518, 1128, 1731, 729,
    874, 1129, 2124, 1290, 119, 2254, 320, 905, 940, 1649, 1738,
    1947, 95, 942, 2115, 2004, 2144, 1493, 1635, 1532, 617, 832,
    1174, 2083, 1377, 831, 1088, 692, 1878, 1329, 1610, 439, 494,
    1073, 1300, 1038, 1387, 1900, 510, 866, 2252, 303, 1834, 2212,
    377, 570, 1156, 514, 2165, 591, 1200, 390, 1355, 83, 845, 2000,
    829, 756, 2046, 452, 1159, 1085, 1055, 1529, 1189, 214, 1045,
    784, 975, 2009, 1199, 1151, 2234, 1565, 1844, 1220, 547, 1998,
    1275, 1680, 1577, 1401, 908, 956, 528, 976, 184, 787, 315, 174,
    1871, 890, 773, 1168, 1607, 854, 1228, 682, 732, 2114, 876,
    1067, 846, 72, 896, 772, 1594, 345, 1613, 2141, 1552, 1305,
    257, 2159, 693, 187, 1455, 1515, 897, 513, 631, 2275, 697, 599,
    775, 581, 752, 1012, 427, 22, 558, 807, 129, 1119, 1642, 240,
    567, 176, 1678, 864, 1134, 1726, 2291, 815, 275, 260, 2250,
    2018, 1866, 1303, 2071, 2170, 2292, 443, 1559, 1103, 1544, 1087,
    1958, 774, 563, 663, 1995, 930, 86, 130, 885, 169, 888, 1877,
    412, 134, 593, 2230, 1778, 105, 144, 1908, 1445, 1094, 447,
    1734, 126, 2119, 2237, 329, 2177, 2011, 1014, 1117, 1391, 1647,
    461, 1480, 2285, 339, 1327, 165, 2160, 1611, 446, 352, 2158,
    1637, 759, 189, 84, 204, 1135, 1400, 679, 822, 548, 1141, 781,
    198, 1808, 883, 1764, 357, 1653, 11, 1619, 1546, 55, 668, 1261,
    2032, 1160, 1553, 1708, 2299, 988, 1341, 1651, 181, 1956, 1691,
    1665, 1570, 931, 108, 36, 1783, 442, 1987, 1545, 607, 1667,
    1826, 2082, 576, 2203, 1195, 573, 701, 2161, 117, 1359, 162,
    1597, 1771, 2163, 123, 1287, 167, 572, 1463, 1043, 456, 1803,
    2133, 1417, 1271, 347, 78, 154, 560, 789, 1238, 726, 686, 1163,
    1426, 702, 2049, 838, 941, 780, 1819, 448, 1428, 0, 1413, 535,
    1891, 728, 380, 1263, 405, 1252, 1692, 1837, 1437, 696, 1209,
    1714, 715, 932, 2060, 372, 520, 2095, 852, 798, 1021, 1110,
    2243, 1562, 2215, 228, 724, 1753, 2058, 763, 745, 359, 1398,
    1916, 1770, 951, 1026, 2121, 463, 1735, 721, 748, 2283, 953,
    480, 25, 451, 2081, 525, 2153, 51, 2259, 865, 1659, 1928, 2258,
    149, 1351, 333, 688, 1909, 279, 267, 2233, 825, 1198, 2122,
    973, 1178, 2064, 1616, 1641, 1831, 1969, 1575, 2303, 505, 1842,
    1358, 1333, 1568, 1810, 1918, 1913, 290, 124, 1243, 990, 580,
    2302, 2196, 1481, 2037, 817, 511, 1614, 684, 1526, 1926, 1114,
    391, 977, 667, 2271, 1215, 286, 1833, 1740, 1257, 1555, 562,
    59, 1795, 1096, 30, 1615, 1266, 1, 1843, 1210, 280, 1254, 713,
    1476, 900, 809, 1943, 677, 1855, 589, 477, 714, 1015, 2048,
    324, 777, 903, 2162, 1216, 1464, 2021, 247, 307, 435, 1792,
    1299, 1010, 2025, 2261, 1454, 649, 1433, 814, 65, 1166, 243,
    1130, 444, 1202, 553, 821, 1634, 638, 962, 219, 1291, 1003,
    1035, 1582, 503, 621, 1245, 1677, 871, 327, 1960, 1920, 1865,
    423, 808, 1681, 2047, 755, 665, 750, 705, 2277, 655, 1799, 1470,
    914, 2093, 1506, 618, 85, 122, 565, 420, 1896, 212, 1666, 1551,
    966, 1477, 2280, 1510, 1874, 153, 2184, 993, 475, 334, 2225,
    1472, 404, 350, 1927, 757, 337, 321, 2268, 1448, 1320, 208,
    1446, 82, 1537, 492, 2098, 180, 495, 842, 1536, 1513, 1041,
    826, 1574, 160, 869, 1407, 806, 379, 521, 1686, 1822, 1668,
    498, 1919, 2130, 1090, 1695, 823, 2213, 1487, 583, 471, 2194,
    1255, 691, 1556, 310, 1646, 1409, 483, 1521, 1203, 863, 616,
    386, 1769, 588, 810, 1052, 173, 426, 582, 2077, 1236, 250, 653,
    1994, 99, 1978, 879, 1406, 2134, 1280, 1131, 89, 1578, 1687,
    1127, 920, 1058, 550, 2084, 912, 707, 1286, 1932, 924, 1205,
    328, 26, 594, 2274, 1032, 1576, 604, 276, 1725, 1495, 1244,
    1509, 1412, 1140, 995, 875, 1443, 1272, 529, 1478, 103, 220,
    1427, 2126, 1648, 1870, 1311, 622, 964, 1679, 1505, 140, 1981,
    918, 2099, 561, 150, 645, 101, 1643, 676, 1181, 612, 215, 613,
    1885, 2038, 765, 1139, 1284, 2096, 737, 1925, 657, 716, 972,
    722, 1757, 1887, 23, 429, 1132, 585, 164, 1867, 1376, 1034,
    595, 1111, 455, 786, 790, 2210, 1904, 1438, 1675, 464, 239,
    656, 1533, 1702, 1864, 1201, 1106, 319, 1540, 1086, 1371, 646,
    1910, 2263, 1013, 100, 1588, 1396, 986, 111, 1672, 1153, 1688,
    1791, 428, 1044, 1820, 1294, 1737, 760, 2019, 1298, 893, 1442,
    1873, 1095, 1661, 1047, 1234, 555, 1991, 1118, 2218, 488, 485,
    666, 1219, 904, 112, 1434, 783, 2002, 1685, 803, 675, 1115,
    402, 610, 255, 137, 1930, 983, 231, 639, 17, 1084, 1707, 1260,
    704, 2055, 967, 145, 1071, 87, 1839, 1213, 963, 1390, 2195,
    2003, 138, 2244, 1169, 396, 2305, 2211, 1876, 2182, 1063, 1827,
    1357, 2309, 1488, 411, 819, 2294, 410, 2198, 194, 1554, 2080,
    1705, 611, 1729, 353, 968, 923, 1539, 1040, 1906, 2100, 381,
    735, 1315, 1744, 1233, 791, 1137, 2129, 1023, 1656, 2181, 1663,
    449, 403, 531, 1752, 1595, 313, 2297, 2248, 961, 619, 1473,
    820, 989, 1051, 1620, 349, 50, 1756, 1116, 171, 712, 1660, 1167,
    1457, 926, 1430, 270, 142, 1161, 277, 1806, 506, 1256, 1441,
    2010, 2189, 647, 1571, 1285, 91, 2272, 2173, 1948, 916, 1901,
    1501, 185, 1508, 490, 56, 1142, 710, 2008, 2127, 1296, 836,
    468, 769, 57, 1042, 708, 1240, 2107, 2106, 1221, 1700, 424,
    218, 635, 2240, 549, 1451, 880, 2142, 2146, 1968, 1069, 1150,
    1227, 1965, 437, 1823, 1065, 458, 1996, 367, 1180, 37, 75, 369,
    71, 955, 1894, 1449, 596, 1631, 1924, 1911, 418, 395, 551, 283,
    2088, 2137, 1432, 1361, 1903, 2270, 496, 1415, 720, 1863, 2282,
    232, 203, 143, 67, 1025, 264, 1101, 2287, 94, 1605, 360, 1835,
    1302, 132, 1563, 2067, 2091, 2074, 387, 2097, 1706, 1335, 58,
    1033, 1027, 985, 161, 1573, 1747, 1814, 1482, 2024, 7, 136,
    1078, 1846, 2065, 2089, 1765, 1295, 725, 669, 970, 299, 1029,
    922, 224, 711, 221, 12, 980, 2149, 93, 636, 1402, 2201, 1165,
    1138, 1897, 2191, 1112, 41, 1503, 237, 935, 1608, 116, 2281,
    1512, 1046, 1709, 1224, 508, 764, 1498, 1902, 1143, 1048, 1251,
    844, 971, 2143, 1829, 1109, 811, 459, 761, 2150, 1794, 1031,
    2041, 1075, 249, 332, 1145, 2167, 1802, 45, 325, 235, 1289, 64,
    62, 258, 661, 1319, 42, 406, 944, 2307, 416, 1419, 27, 1253,
    445, 877, 1858, 489, 1693, 2279, 245, 554, 1000, 79, 1444, 54,
    527, 1673, 193, 1190, 1933, 1743, 557, 1845, 1385, 309, 1748,
    915, 1886, 1460, 2183, 804, 552, 742, 265, 2236, 1548, 2139,
    110, 436, 388, 1226, 1328, 1690, 1281, 2057, 1621, 227, 801,
    913, 2017, 415, 302, 1004, 828, 262, 335, 929, 202, 151, 1039,
    1364, 2295, 1549, 1507, 2235, 812, 1036, 894, 792, 1972, 1517,
    1547, 1525, 1447, 1804, 2223, 1188, 1265, 1657, 1380, 1384,
    1761, 2187, 222, 1811, 114, 1704, 191, 213, 1790, 718, 1957,
    2073, 957, 192, 1952, 1749, 148, 1942, 928, 336, 1435, 2192,
    746, 348, 1366, 1818, 271, 1196, 937, 1499, 1081, 699, 355,
    969, 534, 253, 1593, 855, 1949, 2033, 268, 2208, 1767, 1976,
    364, 2246, 102, 2068, 1785, 47, 2070, 1093, 727, 2086, 2164,
    341, 1330, 600, 175, 537, 1856, 394, 698, 223, 629, 895, 1980,
    1696, 1292, 1283, 20, 1313, 1624, 1971, 559, 61, 689, 274, 1953,
    569, 602, 2227, 1561, 2028, 1386, 4, 1414, 1458, 592, 1500,
    818, 1373, 1389, 226, 1609, 1938, 934, 2148, 539, 917, 1060,
    195, 323, 1104, 571, 1375, 1404, 906, 1070, 637, 1467, 1541,
    2140, 241, 2104, 1763, 1798, 478, 1872, 1079, 856, 782, 295,
    1068, 1204, 1523, 1977, 1543, 785, 2224, 278, 868, 949, 166,
    1173, 526, 889, 794, 1053, 298, 1212, 1037, 1149, 1601, 2238,
    8, 685, 1184, 96, 2245, 1989, 1572, 1270, 1489, 641, 484, 1789,
    2109, 1830, 1217, 1899, 398, 450, 739, 1024, 672, 2221, 1399,
    98, 311, 519, 2175, 1028, 2066, 128, 481, 1861, 2241, 1125,
    2278, 1934, 2113, 887, 1162, 2265, 1768, 1813, 16, 540, 330,
    1766, 1307, 172, 994, 179, 1694, 1941, 767, 717, 586, 1091,
    515, 843, 530, 43, 1879, 1940, 2108, 115, 1912, 1730, 860, 1235,
    1378, 2090, 2029, 1452, 899, 197, 242, 578, 833, 434, 1862,
    356, 186, 382, 1628, 2202, 120, 2251, 1340, 564, 2266, 1566,
    597, 1468, 770, 14, 2188, 1888, 620, 2118, 2228, 1779, 1490,
    1331, 2014, 1652, 1773, 1805, 1860, 1914, 1099, 1211, 2076,
    1250, 470, 1514, 901, 690, 1983, 1001, 546, 605, 1584, 1054,
    1718, 723, 2171, 1592, 1775, 524, 1242, 288, 1669, 225, 1369,
    1258, 1560, 1777, 660, 1326, 2314, 417, 131, 999, 1381, 1782,
    292, 1954, 1383, 1596, 577, 1982, 1684, 159, 2102, 343, 1274,
    1824, 678, 462, 1176, 183, 733, 614, 1716, 2128, 1739, 1869,
    2276, 662, 118, 2174, 861, 1683, 2239, 1724, 1097, 1884, 2110,
    1664, 133, 683, 374, 2220, 2301, 491, 1905, 1379, 1018, 236,
    1403, 1416, 66, 1089, 1246, 39, 1229, 2061, 1990, 839, 1050,
    1273, 2056, 1239, 500, 981, 1586, 1492, 1519, 1745, 859, 358,
    2006, 2039, 259, 1629, 1550, 543, 1193, 1721, 1754, 5, 987,
    1456, 1836, 1318, 2005, 797, 1338, 1522, 385, 1418, 2007, 2154,
    1092, 422, 1892, 1587, 1192, 2105, 1395, 615, 1059, 1479, 1797,
    2205, 608, 1064, 297, 2217, 1939, 910, 680, 1350, 1206, 73,
    2050, 407, 460, 1655, 1411, 158, 974, 1807, 1107, 743, 1881,
    799, 1728, 1946, 945, 512, 1423, 109, 740, 2219, 2136, 747,
    556, 2069, 719, 776, 2063, 188, 1248, 1197, 1720, 630, 2027,
    1636, 626, 992, 1020, 2172, 127, 2116, 53, 853, 2078, 1485,
    1223, 2222, 706, 13, 80, 1944, 272, 2193, 1815, 229, 670, 1535,
    479, 1301, 401, 88, 371, 778, 331, 1589, 950, 376, 1710, 1098,
    344, 1962, 2298, 1986, 1857, 1528, 107, 474, 1222, 1267, 1583,
    1469, 1278, 1066, 891, 273, 1699, 1788, 835, 1155, 2044, 1372,
    1929, 1082, 1639, 1334, 1465, 1057, 598, 648, 1898, 830, 870,
    1352, 1076, 301, 414, 1471, 991, 1304, 29, 1524, 1787, 2207,
    1841, 190, 664, 1453, 805, 289, 1755, 2311, 1698, 2289, 177,
    1603, 1314, 541, 1297, 1187, 199, 1538, 960, 1717, 1850, 627,
    431, 438, 384, 590, 1317, 15, 1812, 1776, 1268, 2257, 2152,
    419, 318, 1208, 157, 1019, 654, 1727, 736, 31, 516, 1840, 304,
    1997, 375, 1999, 1421, 687, 1214, 779, 947, 862, 954, 1626,
    1772, 640, 695, 97, 408, 1715, 1630, 1122, 306, 1640, 10, 1354,
    1288, 609, 1306, 1598, 287, 1599, 33, 393, 1746, 1966, 1893,
    997, 2232, 254, 1821, 1786, 1459, 90, 296, 1123, 1516, 1591,
    1907, 77, 1425, 1148, 709, 74, 857, 681, 146, 840, 1360, 544,
    834, 2269, 651, 294, 1322, 1349, 1742, 536, 1945, 1016, 979,
    282, 1590, 984, 898, 1474, 2200, 659, 1429, 2053, 1975, 1606,
    69, 768, 1816, 60, 1363, 1337, 308, 2180, 793, 2313, 1520, 2043,
    2267, 2253, 1713, 1461, 1880, 1072, 1218, 884, 850, 2273, 1758,
    1009, 24, 2204, 1964, 1612, 643, 1723, 1121, 907, 902, 1158,
    1136, 1362, 1030, 1638, 796, 1397, 1604, 1937, 703, 263, 1985,
    314, 368, 178, 210, 1339, 1627, 182, 1650, 2264, 1781, 1405,
    2013, 517, 6, 1662, 633, 121, 2306, 300, 2123, 1182, 2284, 837,
    230, 878, 425, 671, 34, 2209, 1440, 2051, 1276, 1249, 1486,
    2310, 601, 256, 1077, 2190, 170, 532, 2226, 788, 2262, 19, 1316,
    1625, 632, 1557, 1859, 952, 1774, 1146, 1832, 338, 370, 1382,
    1504, 493, 1674, 2199, 2288, 568, 269, 351, 1567, 2304, 730,
    1061, 1171, 2256, 1157, 1439, 849, 1191, 2169, 1701, 2293, 1531,
    49, 700, 453, 886, 847, 139, 936, 1344, 1147, 938, 882, 113,
    32, 1800, 206, 2034, 2125, 469, 430, 587, 476, 312, 2168, 1343,
    1345, 152, 1511, 433, 1074, 293, 1177, 141, 1325, 409, 1801,
    40, 1062, 1422, 1849, 1484, 1670, 2054, 1847, 1895, 1179, 246,
    147, 125, 1890, 1703, 2178, 2145, 2001, 533, 927, 872, 156,
    2030, 21, 1262, 342, 457, 943, 658, 892, 196, 909, 432, 1005,
    731, 1475, 168, 1237, 2312, 579, 2045, 2023, 1049, 1017, 1080,
    1164, 642, 216, 266, 1564, 2020, 1931, 1494, 522, 28, 454, 1462,
    2111, 2216, 754, 1935, 2260, 603, 800, 1963, 2062, 1186, 18,
    813, 1450, 1356, 244, 1466, 1750, 1682, 1793, 291, 1697, 933,
    48, 205, 911, 1784, 1762, 753, 1393, 316, 2135, 2231, 2156,
    2103, 771, 1585, 1483, 802, 1736, 749, 2185, 1751, 373, 2040,
    841, 1491, 1336, 1654, 538, 982, 2016, 1083, 473, 2042, 1760,
    63, 2155, 76, 939, 1126, 1353, 1644, 1780, 200, 1809, 106, 1951,
    2147, 1102, 2179, 2075, 2186, 281, 1424, 1365, 238, 466, 1279,
    2079, 1420, 92, 1711, 1259, 762, 1959, 1183, 624, 758, 1955,
    1144, 2015, 163, 1518, 1309, 1175, 2059, 2249, 502, 2286, 1984,
    2131, 1602, 1852, 9, 285, 921, 1502, 389, 1921, 1868, 795, 1312,
    1496, 1230, 1332, 1277, 35, 1733, 365, 378, 251, 2, 1882, 919,
    1408, 234, 252, 1008, 766, 1854, 1617, 751, 1231, 1600, 2132,
    623, 2036, 2117, 2120, 397, 1225, 827, 650, 501, 2138, 1431,
    1580, 1497, 1185, 1967, 873, 575, 467, 1817, 2206, 305, 340,
    363, 155, 497, 2112, 1342, 104, 2026, 1759, 625, 738, 1392,
    217, 1172, 487, 1979, 1194, 545, 2242, 1915, 211, 2255, 634,
    1828, 38, 248, 744, 399, 824, 946, 523, 509, 322, 1922, 383,
    1970, 1796, 741, 400, 1022, 1645, 3, 1618, 958, 1282, 2308,
    1712, 261, 1988, 2229, 2247, 867, 1992, 1530, 2012, 574, 2085,
    46, 1527, 2094, 2290, 1410, 1011, 1056, 1133, 606, 881, 542,
    201, 2296, 1622, 1348, 1154, 233, 1961, 2035, 1569, 851, 326,
    1558, 70, 2087, 1825, 1883, 1838, 1108, 1633, 1241, 472, 1623,
    2157, 1346, 1632, 2300, 2052, 1002, 1581, 317, 925, 848, 441,
    1120, 1207, 1247, 1368, 1848, 68, 354, 1170, 421, 2151, 1671,
    1367, 2022, 1293, 135, 362, 1394, 1232, 1347, 1113, 486, 628,
    1388, 1374, 978, 674, 1973, 1534, 1579, 392, 440, 1722, 644,
    1324, 1124, 1323, 1542, 44, 465, 1152, 694, 507, 284, 81, 1889,
    959, 1689, 1308, 499, 858, 673, 1993, 1264, 207, 52, 1974, 1370,
    996, 1321, 2101, 584, 1719, 948, 346, 2092, 2197, 1269, 413,
    1007, 2031, 361, 482, 366, 209, 566, 1732, 652, 1923, 1741,
    1658, 504, 1875, 1310, 1436, 2166, 998, 1105, 2214, 965, 1851];

