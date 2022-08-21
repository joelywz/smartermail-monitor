package keep

import "github.com/golang-module/dongle"

func Decrypt(data []byte, key []byte, iv []byte) []byte {
	cipher := dongle.NewCipher()

	cipher.SetMode(dongle.CBC)      // CBC, ECB, CFB, OFB, CTR, GCM
	cipher.SetPadding(dongle.PKCS7) // No, Zero, PKCS5, PKCS7
	cipher.SetKey(key)              // key must be 16, 24 or 32 bytes
	cipher.SetIV(iv)                // iv must be 16, 24 or 32 bytes

	return dongle.Decrypt.FromBytes(data).ByAes(cipher).ToBytes()
}
