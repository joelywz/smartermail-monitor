package encrypter

import (
	"errors"
	"fmt"

	"github.com/golang-module/dongle"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

var ErrInvalidPassword = errors.New("invalid password")

func Encrypt(data string, password string) (string, error) {

	salt := gonanoid.Must(6)
	cipher := createCipher(password)

	d := dongle.Encrypt.FromString(fmt.Sprintf("%s%s", salt, data)).ByAes(cipher)

	if d.Error != nil {
		return "", d.Error
	}

	return fmt.Sprintf("%s%s", salt, d.ToHexString()), nil
}

func Decrypt(data string, password string) (dv string, err error) {
	cipher := createCipher(password)

	if len(data) < 6 {
		return "", ErrInvalidPassword

	}

	salt := data[:6]

	defer func() {
		if r := recover(); r != nil {
			err = ErrInvalidPassword
			dv = ""
			return
		}
	}()

	d := dongle.Decrypt.FromHexString(data[6:]).ByAes(cipher)

	if d.Error != nil {
		return "", errors.Join(d.Error, ErrInvalidPassword)
	}

	de := d.String()

	if len(de) < 6 {
		return "", ErrInvalidPassword
	}

	if de[:6] != salt {
		return "", ErrInvalidPassword
	}

	return de[6:], nil
}

func createCipher(password string) *dongle.Cipher {
	hashed := Hash(password)

	cipher := dongle.NewCipher()
	cipher.SetMode(dongle.CBC)
	cipher.SetPadding(dongle.PKCS7)
	cipher.SetKey(hashed)
	cipher.SetIV(hashed[:16])

	return cipher
}

func Hash(password string) []byte {
	return dongle.Encrypt.FromString(password).BySha256().ToRawBytes()
}
