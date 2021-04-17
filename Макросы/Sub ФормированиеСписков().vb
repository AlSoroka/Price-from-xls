Sub ÔîðìèðîâàíèåÑïèñêîâ()
'
' ÔîðìèðîâàíèåÑïèñêîâ Ìàêðîñ
'
'
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find.Replacement.Font
        .SmallCaps = False
        .AllCaps = False
    End With

    With Selection.Find
        .Text = "(:^13)([à-ÿ])"
        .Replacement.Text = "\1<ul>^p<li>\2"
        .Forward = True
        .Wrap = wdFindAsk
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    With Selection.Find
        .Text = "(;)^13"
        .Replacement.Text = "\1</li>^p<li>"
        .Forward = True
        .Wrap = wdFindAsk
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    With Selection.Find
        .Text = "(<li>*.)^13"
        .Replacement.Text = "\1</li>^p</ul>^p"
        .Forward = True
        .Wrap = wdFindAsk
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    
    Selection.Find.Execute Replace:=wdReplaceAll
End Sub
Sub ÇàìåíàÏðîáåëîâ()
'
' ÇàìåíàÏðîáåëîâ Ìàêðîñ
'
'
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find.Replacement.Font
        .SmallCaps = False
        .AllCaps = False
    End With
    With Selection.Find
        .Text = "(<[À-ßà-ÿ]{1;3}) "
        .Replacement.Text = "\1^s"
        .Forward = True
        .Wrap = wdFindAsk
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    ActiveWindow.ActivePane.SmallScroll Down:=129
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find.Replacement.Font
        .SmallCaps = False
        .AllCaps = False
    End With
    With Selection.Find
        .Text = "(<[À-ßà-ÿ]{1;3}) "
        .Replacement.Text = "\1^s"
        .Forward = True
        .Wrap = wdFindAsk
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
End Sub
Sub Àáçàöû()
'
' Àáçàöû Ìàêðîñ
'
'
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find.Replacement.Font
        .SmallCaps = False
        .AllCaps = False
    End With
    With Selection.Find
        .Text = "^13([0-9À-ß])"
        .Replacement.Text = "^p" & ChrW(9825) & "<p>\1"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find.Replacement.Font
        .SmallCaps = False
        .AllCaps = False
    End With
    With Selection.Find
        .Text = "(\<p\>*)(^13)" & ChrW(9825)
        .Replacement.Text = "\1</p>^p"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    
End Sub
Sub ÃëàâûÈñòàòüè()
'
' ÃëàâûÈñòàòüè Ìàêðîñ
'
'
    Selection.Find.ClearFormatting
    Selection.Find.Style = ActiveDocument.Styles("chapter")
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find
        .Text = "(*)^13"
        .Replacement.Text = "<h3>\1</h3>^p"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    Selection.Find.ClearFormatting
    Selection.Find.Style = ActiveDocument.Styles("chapter")
    Selection.Find.Replacement.ClearFormatting
        With Selection.Find
        .Text = "^l"
        .Replacement.Text = "<br>^l"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    Selection.Find.ClearFormatting
    Selection.Find.Style = ActiveDocument.Styles("article")
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find
        .Text = "(*)^13"
        .Replacement.Text = "<h4>\1</h4>^p"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
End Sub
Sub ÇàãîëîâêèÈïîäïèñü()
'
' ÇàãîëîâêèÈïîäïèñü Ìàêðîñ
'
'
    Selection.MoveUp Unit:=wdLine, Count:=2
    Selection.Find.ClearFormatting
    Selection.Find.Style = ActiveDocument.Styles("prinodobren")
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find
        .Text = "(*)^13"
        .Replacement.Text = "<p class=""prinodobren"">\1</p>^p"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    Selection.Find.ClearFormatting
    Selection.Find.Style = ActiveDocument.Styles("Íàçâàíèå1")
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find
        .Text = "(*)^13"
        .Replacement.Text = "<h2>\1</h2>^p"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
        .MatchAllWordForms = False
        .MatchSoundsLike = False
        .MatchWildcards = True
    End With
End Sub
