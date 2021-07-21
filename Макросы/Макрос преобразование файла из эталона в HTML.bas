Attribute VB_Name = "NewMacros"
Sub РазделыВзаголовкиH2()
    
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    Selection.Find.Replacement.Style = ActiveDocument.Styles("Обычный (веб)")
    With Selection.Find
        .Text = "(РАЗДЕЛ [C-X]{1;6}*)^13"
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
    Selection.Find.Execute Replace:=wdReplaceAll
End Sub

Sub ГлавыВзаголовкиH3()

    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    Selection.Find.Replacement.Style = ActiveDocument.Styles("Обычный (веб)")
    With Selection.Find
        .Text = "(ГЛАВА [0-9]{1;6}*)^13"
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
End Sub


Sub СозданиеСписков()
'
' Создание списков в выделенной области
'
'
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find.Replacement.Font
        .SmallCaps = False
        .AllCaps = False
    End With

    With Selection.Find
        .Text = "(:^13)"
        .Replacement.Text = "\1<ul>^p<li>"
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
Sub Абзацы()
'
' Абзацы Макрос
'
'
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    Selection.Find.Replacement.Style = ActiveDocument.Styles("Обычный (веб)")
    With Selection.Find
        .Text = "^13([А-Я0-9]*)"
        .Replacement.Text = "^p<p>\1"
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
    Selection.Find.Replacement.Style = ActiveDocument.Styles("Обычный (веб)")
    With Selection.Find
        .Text = "([.])^13(\<p\>)"
        .Replacement.Text = "\1</p>^p\2"
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
Sub ЗаменаПробелов()

    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find.Replacement.Font
        .SmallCaps = False
        .AllCaps = False
    End With
    With Selection.Find
        .Text = "(<[А-Яа-я0-9, №]{1;3}) "
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
    Selection.Find.ClearFormatting
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find.Replacement.Font
        .SmallCaps = False
        .AllCaps = False
    End With

End Sub


