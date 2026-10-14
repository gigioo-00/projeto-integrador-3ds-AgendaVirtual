import json

lista_agenda = [
    {
        "id": 1,
        "titulo": "Reunião de Pais",
        "data": "2026-08-05 H:10:00",
        "status": "Não visualizado",
    },
    {
        "id": 2,
        "titulo": "Concurso de desenho, para a amostra cultural",
        "data": "2026-08-05 H:15:00",
        "status": "Visualizado",
    },
    {
        "id": 3,
        "titulo": "Apresentação de chapas ao grêmio estudantil",
        "data": "2026-08-06 H:10:30",
        "status": "Visualizado",
    },
]


def alterar_status(id_tarefa, novo_status):
    tarefa_encontrada = next(
        (item for item in lista_agenda if item["id"] == id_tarefa), None
    )

    if tarefa_encontrada:
        tarefa_encontrada["status"] = novo_status
        print(
            f'✅ Sucesso: O status da tarefa ID {id_tarefa} mudou para "{novo_status}".'
        )
    else:
        print(f"❌ Erro: Nenhuma tarefa foi encontrada com o ID {id_tarefa}.")


def test_alterar_status_atualiza_tarefa(monkeypatch, capsys):
    monkeypatch.setitem(lista_agenda[0], "status", "Não visualizado")

    alterar_status(1, "Visualizado")

    assert lista_agenda[0]["status"] == "Visualizado"
    assert 'mudou para "Visualizado"' in capsys.readouterr().out


def test_alterar_status_informa_id_inexistente(capsys):
    alterar_status(999, "Visualizado")

    assert "Nenhuma tarefa foi encontrada com o ID 999" in capsys.readouterr().out
