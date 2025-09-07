# QR Kodları Test İçin

## Demo QR Kodları

### AKAFE QR Code:
```json
{
  "cafeId": "demo_cafe_001",
      "cafeName": "AKAFE",
    "location": "Moscow, Arbat St. 1",
  "apiEndpoint": "http://localhost:3000/api"
}
```

### Coffee House QR Kodu:
```json
{
  "cafeId": "demo_cafe_002", 
  "cafeName": "Coffee House",
      "location": "St. Petersburg, Nevsky Prospect 50",
  "apiEndpoint": "http://localhost:3001/api"
}
```

### Brew & Bean QR Kodu:
```json
{
  "cafeId": "demo_cafe_003",
  "cafeName": "Brew & Bean", 
      "location": "Kazan, Bauman St. 15",
  "apiEndpoint": "http://localhost:3002/api"
}
```

## QR Kod Oluşturma

1. **Online QR Generator** kullanın: https://www.qr-code-generator.com/
2. Yukarıdaki JSON verilerini kopyalayın
3. QR kod oluşturun ve indirin
4. Simülatörde test edin

## Simülatörde Test

### iOS Simulator:
1. QR kodu bilgisayarınızda açın
2. Simülatörde kamera uygulamasını açın
3. QR kodu tarayın

### Android Emulator:
1. QR kodu bilgisayarınızda açın  
2. Emülatörde kamera uygulamasını açın
3. QR kodu tarayın

## Alternatif Test Yöntemleri

### 1. Manuel Giriş (En Kolay):
- In the app, press the "Enter Cafe ID Manually" button
- Select the "Enter" option
- Demo kafe otomatik yüklenecek

### 2. Deep Link Test:
```
cafeapp://?cafeId=demo_cafe_001&cafeName=AKAFE&location=Moscow&apiEndpoint=http://localhost:3000/api
```

### 3. Web URL Test:
```
https://cafe-network.com/cafe?cafeId=demo_cafe_001&cafeName=AKAFE&location=Moscow&apiEndpoint=http://localhost:3000/api
```
