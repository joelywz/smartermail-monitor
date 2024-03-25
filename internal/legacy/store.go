package legacy

import (
	"encoding/json"
	"os"

	"github.com/golang-module/dongle"
)

var iv = []byte{117, 198, 35, 158, 66, 75, 117, 93, 86, 48, 127, 177, 51, 93, 249, 50}

func Decrypt(data []byte, key []byte) []byte {

	hashedKey := dongle.Encrypt.FromBytes(key).BySha256().ToRawBytes()

	cipher := dongle.NewCipher()
	cipher.SetMode(dongle.CBC)
	cipher.SetPadding(dongle.PKCS7)
	cipher.SetKey(hashedKey)
	cipher.SetIV(iv)

	return dongle.Decrypt.FromRawBytes(data).ByAes(cipher).ToBytes()
}

func Read(path string, password string) (*Document, error) {

	b, err := os.ReadFile(path)

	if err != nil {
		return nil, err
	}

	var doc Document

	decrypted := Decrypt(b, []byte(password))

	if err := json.Unmarshal(decrypted, &doc); err != nil {
		return nil, err
	}

	return &doc, nil
}
