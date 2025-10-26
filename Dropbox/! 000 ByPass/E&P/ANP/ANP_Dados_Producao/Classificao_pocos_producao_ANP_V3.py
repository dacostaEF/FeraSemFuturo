import tkinter as tk
from tkinter import ttk, filedialog, scrolledtext, messagebox
import pandas as pd
from pathlib import Path
import threading
import re
import unicodedata
import os

# -------------------------------------------------------------
# Funções auxiliares de normalização de colunas
# -------------------------------------------------------------
def _strip_accents(s: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c))

def _find_col(columns, patterns):
    """Encontra coluna usando padrões regex, ignorando espaços extras"""
    canon_map = {col: _canon(col) for col in columns}
    
    for pat in patterns:
        rx = re.compile(pat)
        for col, ccol in canon_map.items():
            if rx.search(ccol):
                return col
    return None

def _canon(s: str) -> str:
    """Normaliza string removendo acentos e espaços extras"""
    s = _strip_accents(s.lower().strip())
    # Remove espaços múltiplos e substitui por único espaço
    s = re.sub(r'\s+', ' ', s)
    return s

# -------------------------------------------------------------
# Classe principal
# -------------------------------------------------------------
class OilWellOrganizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Organizador de Poços – ANP")
        self.root.geometry("980x640")

        self.csv_files = []
        self.output_dir = ""
        self.data_frames = []

        self.setup_ui()

    # ---------------------------------------------------------
    # Interface Tkinter (sem alteração)
    # ---------------------------------------------------------
    def setup_ui(self):
        pad = {"padx": 8, "pady": 6}

        top = ttk.Frame(self.root)
        top.pack(fill="x", **pad)

        ttk.Button(top, text="Selecionar CSVs…", command=self.select_files).pack(side="left", **pad)
        self.lbl_files = ttk.Label(top, text="Nenhum arquivo selecionado")
        self.lbl_files.pack(side="left", **pad)

        ttk.Button(top, text="Pasta de saída…", command=self.select_output_dir).pack(side="left", **pad)
        self.lbl_out = ttk.Label(top, text="Sem pasta definida")
        self.lbl_out.pack(side="left", **pad)

        actions = ttk.Frame(self.root)
        actions.pack(fill="x", **pad)

        self.btn_load = ttk.Button(actions, text="Carregar & Analisar", command=self.start_load_and_analyze, state="disabled")
        self.btn_load.pack(side="left", **pad)

        self.btn_process = ttk.Button(actions, text="Processar", command=self.start_process_files, state="disabled")
        self.btn_process.pack(side="left", **pad)

        center = ttk.Panedwindow(self.root, orient="horizontal")
        center.pack(fill="both", expand=True, **pad)

        left = ttk.Labelframe(center, text="Resumo")
        center.add(left, weight=1)
        self.summary_box = scrolledtext.ScrolledText(left, height=12, wrap="word")
        self.summary_box.pack(fill="both", expand=True, **pad)

        right = ttk.Labelframe(center, text="Log")
        center.add(right, weight=1)
        self.log_box = scrolledtext.ScrolledText(right, height=12, wrap="word")
        self.log_box.pack(fill="both", expand=True, **pad)

        footer = ttk.Frame(self.root)
        footer.pack(fill="x", **pad)
        ttk.Label(footer, text="Dica: CSVs ANP usam ';' e vírgula decimal. Cabeçalho começa na linha 5.").pack(side="left", padx=4)

    # ---------------------------------------------------------
    # Eventos dos botões (sem alteração)
    # ---------------------------------------------------------
    def select_files(self):
        files = filedialog.askopenfilenames(title="Selecione os arquivos CSV", filetypes=[("CSV", "*.csv")])
        if files:
            self.csv_files = list(files)
            self.lbl_files.config(text=f"{len(self.csv_files)} arquivo(s) selecionado(s)")
            self.log_message(f"Selecionados {len(self.csv_files)} arquivo(s).")
            self.check_ready_to_analyze()

    def select_output_dir(self):
        out = filedialog.askdirectory(title="Selecione a pasta de saída")
        if out:
            self.output_dir = out
            self.lbl_out.config(text=self.output_dir)
            self.log_message(f"Pasta de saída definida: {self.output_dir}")
            self.check_ready_to_process()

    def start_load_and_analyze(self):
        if not self.csv_files:
            messagebox.showwarning("Atenção", "Selecione ao menos um CSV.")
            return
        self.toggle_buttons(True)
        threading.Thread(target=self.load_and_analyze_files, daemon=True).start()

    def start_process_files(self):
        if not self.data_frames:
            messagebox.showwarning("Atenção", "Carregue e analise os dados antes de processar.")
            return
        if not self.output_dir:
            messagebox.showwarning("Atenção", "Defina a pasta de saída antes de processar.")
            return
        self.toggle_buttons(True)
        threading.Thread(target=self.process_files, daemon=True).start()

    def toggle_buttons(self, disabled: bool):
        state = "disabled" if disabled else "normal"
        self.btn_load.config(state=("normal" if (self.csv_files and not disabled) else "disabled"))
        self.btn_process.config(state=("normal" if (self.data_frames and self.output_dir and not disabled) else "disabled"))

    # ---------------------------------------------------------
    # Utilidades de interface (sem alteração)
    # ---------------------------------------------------------
    def log_message(self, msg: str, clear=False):
        def _write():
            if clear:
                self.log_box.delete("1.0", "end")
            self.log_box.insert("end", msg + "\n")
            self.log_box.see("end")
        self.root.after(0, _write)

    def update_summary(self, text: str):
        def _write():
            self.summary_box.delete("1.0", "end")
            self.summary_box.insert("1.0", text)
        self.root.after(0, _write)

    def check_ready_to_analyze(self):
        self.btn_load.config(state=("normal" if self.csv_files else "disabled"))

    def check_ready_to_process(self):
        can = bool(self.data_frames) and bool(self.output_dir)
        self.btn_process.config(state=("normal" if can else "disabled"))

    def finish_processing(self):
        self.toggle_buttons(False)
        self.check_ready_to_analyze()
        self.check_ready_to_process()

    # ---------------------------------------------------------
    # Limpeza de nomes de arquivo (sem alteração)
    # ---------------------------------------------------------
    def _clean_filename(self, name):
        if pd.isna(name):
            return "SEM_NOME"
        name = str(name).strip()
        # Garante que SEM_NOME seja retornado se a string for vazia após o strip
        if not name:
             return "SEM_NOME"
        name = (name.replace(':', '_').replace('/', '_').replace('\\', '_')
                         .replace('*', '_').replace('?', '_').replace('"', '_')
                         .replace('<', '_').replace('>', '_').replace('|', '_')
                         .replace(' ', '_'))
        return name[:50]

    # ---------------------------------------------------------
    # Carregar e analisar arquivos CSV (ALTERADO)
    # ---------------------------------------------------------
def load_and_analyze_files(self):
    self.log_message("Carregando e analisando arquivos...", clear=True)
    self.data_frames = []

    # Padrões CORRIGIDOS para colunas ANP
    PAT = {
        # "Nome Poço" tem espaço duplo no CSV da ANP!
        'Nome_Poco': [r'nome\s+poco', r'nome\s*poco', r'poco', r'well'],
        'Campo': [r'campo', r'field'],
        'Periodo_Str': [r'periodo', r'competencia', r'mes\s*ano', r'ano\s*mes', r'referencia'],
        # Óleo pode aparecer como "Óleo (bbl/dia)" ou "Petróleo (bbl/dia)"
        'Oleo_bbl_dia': [r'oleo\s*\(bbl', r'petroleo\s*\(bbl', r'oil\s*\(bbl'],
        # Gás Total é a coluna que queremos (existe Associado, Não Associado e Gás Total)
        'Gas_Mm3_dia': [r'gas\s+total', r'gas\s+natural.*total', r'gas.*mm3'],
        'Agua_bbl_dia': [r'agua\s*\(bbl', r'water\s*\(bbl'],
    }

    try:
        for i, file in enumerate(self.csv_files, 1):
            self.log_message(f"Lendo arquivo {i}/{len(self.csv_files)}: {os.path.basename(file)}")

            # Ler CSV pulando as 4 primeiras linhas (cabeçalho começa na linha 5)
            df = pd.read_csv(
                file,
                sep=';',
                skiprows=4,
                decimal=',',
                encoding='latin-1',
                dtype=str,
                on_bad_lines='skip'  # Ignora linhas problemáticas
            )

            # Limpar nomes de colunas (remover espaços extras)
            df.columns = df.columns.str.strip()

            # Debug: mostrar colunas encontradas
            self.log_message(f"  Colunas detectadas: {list(df.columns[:5])}...")  # Primeiras 5 colunas

            # Remover linhas completamente vazias
            df.dropna(how="all", inplace=True)

            # Mapear colunas para nomes padrão
            rename_map = {}
            for target, patterns in PAT.items():
                found = _find_col(df.columns, patterns)
                if found:
                    rename_map[found] = target
                    self.log_message(f"  ✓ Mapeado: '{found}' → '{target}'")
                else:
                    self.log_message(f"  ⚠ Não encontrado: {target}")
            
            df = df.rename(columns=rename_map)

            # Avisar se faltar colunas importantes
            faltando = [c for c in PAT.keys() if c not in df.columns]
            if faltando:
                self.log_message(f"  ⚠ Aviso: colunas não encontradas: {faltando}")

            # Limpeza de strings
            for c in ['Campo', 'Nome_Poco']:
                if c in df.columns:
                    df[c] = (
                        df[c]
                        .astype(str)
                        .str.strip()
                        .str.replace(r'[\r\n\t]+', ' ', regex=True)
                        .str.replace(r'\s+', ' ', regex=True)  # Remove espaços múltiplos
                    )
                    df[c] = df[c].replace('', 'Nao_Informado')
                    df[c] = df[c].fillna('Nao_Informado')
                else:
                    df[c] = 'Nao_Informado'

            # Converter datas
            if 'Periodo_Str' in df.columns:
                df['Período'] = pd.to_datetime(df['Periodo_Str'], format='%Y/%m', errors='coerce')
                if df['Período'].isna().all():
                    df['Período'] = pd.to_datetime(df['Periodo_Str'], format='%m/%Y', errors='coerce')

            # Converter numéricos (removendo pontos de milhar primeiro)
            for col in ['Oleo_bbl_dia', 'Gas_Mm3_dia', 'Agua_bbl_dia']:
                if col in df.columns:
                    # Remove pontos de milhar e substitui vírgula por ponto
                    df[col] = (df[col]
                              .str.replace('.', '', regex=False)  # Remove separador de milhar
                              .str.replace(',', '.', regex=False)  # Troca vírgula por ponto
                    )
                    df[col] = pd.to_numeric(df[col], errors='coerce')

            # Selecionar apenas colunas necessárias
            cols_to_keep = ['Nome_Poco', 'Campo', 'Periodo_Str', 'Oleo_bbl_dia', 'Gas_Mm3_dia', 'Agua_bbl_dia', 'Período']
            df_filtered = df.reindex(columns=cols_to_keep, fill_value=None)

            self.data_frames.append(df_filtered)
            self.log_message(f"  ✓ Arquivo {i} carregado ({len(df_filtered)} registros válidos)")

        self.log_message("="*50)
        self.analyze_data()

    except Exception as e:
        import traceback
        self.log_message(f"❌ Erro: {str(e)}")
        self.log_message(traceback.format_exc())
        self.root.after(0, lambda: messagebox.showerror("Erro", f"Erro:\n{str(e)}"))
    finally:
        self.root.after(0, self.finish_processing)















































    # ---------------------------------------------------------
    # Análise resumida dos dados (sem alteração)
    # ---------------------------------------------------------
    def analyze_data(self):
        if not self.data_frames:
            return
        all_data = pd.concat(self.data_frames, ignore_index=True)

        total_registros = len(all_data)
        
        # Corrigido para contar apenas os nomes válidos (diferentes de 'Nao_Informado')
        pocos_unicos = all_data['Nome_Poco'].loc[all_data['Nome_Poco'] != 'Nao_Informado'].nunique() if 'Nome_Poco' in all_data.columns else 0
        campos_unicos = all_data['Campo'].loc[all_data['Campo'] != 'Nao_Informado'].nunique() if 'Campo' in all_data.columns else 0
        
        if 'Campo' in all_data.columns:
            campos = sorted(pd.Series(all_data['Campo']).loc[all_data['Campo'] != 'Nao_Informado'].dropna().unique())
            campos_str = ", ".join(campos[:10])
            if len(campos) > 10:
                campos_str += f" ... (+{len(campos)-10} campos)"
        else:
            campos_str = "N/A"

        if 'Período' in all_data.columns and not all_data['Período'].isnull().all():
            periodo_min = all_data['Período'].min().strftime('%Y/%m')
            periodo_max = all_data['Período'].max().strftime('%Y/%m')
            periodo_str = f"{periodo_min} a {periodo_max}"
        else:
            periodo_str = "N/A"

        summary = f"""
📊 RESUMO DOS DADOS CARREGADOS:

• Total de registros: {total_registros:,}
• Total de poços únicos: {pocos_unicos}
• Total de campos únicos: {campos_unicos}
• Período: {periodo_str}

📍 Campos encontrados:
{campos_str}

✅ Dados prontos para processamento!
"""
        self.update_summary(summary)
        self.check_ready_to_process()
        self.log_message("✓ Análise concluída!")

    # ---------------------------------------------------------
    # Processar e exportar arquivos (ALTERADO)
    # ---------------------------------------------------------
    def process_files(self):
        try:
            self.log_message("="*50, clear=True)
            self.log_message("🚀 INICIANDO PROCESSAMENTO...")
            self.log_message("="*50)

            all_data = pd.concat(self.data_frames, ignore_index=True)
            if 'Campo' not in all_data.columns:
                raise KeyError("Coluna 'Campo' não encontrada.")
            
            # Não remover linhas nulas, pois já tratamos elas com 'Nao_Informado'
            grouped_by_field = all_data.groupby('Campo', dropna=False)
            total_campos = len(grouped_by_field)
            processed_count = 0

            for idx_c, (campo_nome, campo_data) in enumerate(grouped_by_field, 1):
                # O nome do campo agora é sempre uma string (graças ao .fillna na etapa de carga)
                campo_dir = Path(self.output_dir) / self._clean_filename(campo_nome)
                campo_dir.mkdir(parents=True, exist_ok=True)

                self.log_message(f"Processando Campo {idx_c}/{total_campos}: {campo_nome}")

                # O dropna=False garante que poços com o nome 'Nao_Informado' também serão processados
                grouped_by_well = campo_data.groupby('Nome_Poco', dropna=False)
                
                for poco_nome, poco_data in grouped_by_well:
                    # O nome do poço já é string preenchida, mas passamos pelo clean para segurança
                    poco_nome_clean = self._clean_filename(poco_nome) 
                    
                    if 'Período' in poco_data.columns:
                        poco_data = poco_data.sort_values('Período').drop(columns=['Período'])
                    
                    # Garantir que o nome do arquivo seja único e com extensão .csv
                    output_file = campo_dir / f"{poco_nome_clean}.csv"
                    
                    # Remover colunas extras que não são de produção, se necessário
                    cols_export = [col for col in poco_data.columns if col not in ['Campo', 'Nome_Poco', 'Período']]
                    poco_data.to_csv(output_file, index=False, sep=';', decimal=',', encoding='latin-1')
                    processed_count += 1
                
                self.log_message(f"  ✓ {len(grouped_by_well)} poços processados neste campo.")
                

            self.log_message("="*50)
            self.log_message(f"✅ PROCESSAMENTO CONCLUÍDO: {processed_count} poços em {total_campos} campos.")
            self.log_message(f"📁 Arquivos salvos em: {self.output_dir}")

            self.root.after(0, lambda: messagebox.showinfo(
                "Sucesso!",
                f"Processamento concluído!\n\nTotal de poços: {processed_count}\nArquivos salvos em:\n{self.output_dir}"
            ))

        except Exception as e:
            self.log_message(f"❌ ERRO: {str(e)}")
            self.root.after(0, lambda: messagebox.showerror("Erro", f"Erro durante processamento:\n{str(e)}"))
        finally:
            self.root.after(0, self.finish_processing)

# -------------------------------------------------------------
# Ponto de entrada (sem alteração)
# -------------------------------------------------------------
if __name__ == "__main__":
    root = tk.Tk()
    app = OilWellOrganizer(root)
    root.mainloop()