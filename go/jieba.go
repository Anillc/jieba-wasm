package main

import (
	"fmt"
	"strings"
	"syscall/js"

	"github.com/fumiama/jieba"
)

var seg *jieba.Segmenter

func main() {
	jieba := js.Global().Get("jieba")
	jieba.Set("load", js.FuncOf(load))
	jieba.Set("cutAll", js.FuncOf(cutAll))
	jieba.Set("cut", js.FuncOf(cut))
	jieba.Set("cutForSearch", js.FuncOf(cutForSearch))
	select {}
}

func load(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 || args[0].Type().String() != "string" {
		return "requires a string param"
	}
	dict := args[0].String()
	segment, err := jieba.LoadDictionary(strings.NewReader(dict))
	if err != nil {
		fmt.Println(err)
		return err.Error()
	}
	seg = segment
	return nil
}

func cutAll(this js.Value, args []js.Value) interface{} {
	if seg == nil {
		return "jieba is not initialized"
	}
	if len(args) == 0 {
		return "requires at least one param"
	}
	if args[0].Type().String() != "string" {
		return "expected a string param"
	}
	input := args[0].String()
	cut := seg.CutAll(input)
	result := make([]interface{}, len(cut))
	for i, v := range cut {
		result[i] = v
	}
	return result
}

func cut(this js.Value, args []js.Value) interface{} {
	if seg == nil {
		return "jieba is not initialized"
	}
	if len(args) == 0 {
		return "requires at least one param"
	}
	if args[0].Type().String() != "string" {
		return "expected a string param"
	}
	input := args[0].String()
	mode := false
	if len(args) >= 2 {
		if args[1].Type().String() != "boolean" {
			return "expected a boolean param"
		} else {
			mode = args[1].Bool()
		}
	}
	cut := seg.Cut(input, mode)
	result := make([]interface{}, len(cut))
	for i, v := range cut {
		result[i] = v
	}
	return result
}

func cutForSearch(this js.Value, args []js.Value) interface{} {
	if seg == nil {
		return "jieba is not initialized"
	}
	if len(args) == 0 {
		return "requires at least one param"
	}
	if args[0].Type().String() != "string" {
		return "expected a string param"
	}
	input := args[0].String()
	mode := false
	if len(args) >= 2 {
		if args[1].Type().String() != "boolean" {
			return "expected a boolean param"
		} else {
			mode = args[1].Bool()
		}
	}
	cut := seg.CutForSearch(input, mode)
	result := make([]interface{}, len(cut))
	for i, v := range cut {
		result[i] = v
	}
	return result
}
