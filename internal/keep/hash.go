package keep

import (
	"crypto/sha256"
)

func Hash(password string) []byte {
	hasher := sha256.New()

	hasher.Write([]byte(password))
	return hasher.Sum(nil)
}
