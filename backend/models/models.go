package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	ID               int    `json:"id"`
	Name             string `json:"name"`
	Price            int    `json:"price"`
	ShortDescription string `json:"short_description"`
	Description      string `json:"description"`
}
