import tkinter as tk
from tkinter import ttk, filedialog, scrolledtext, messagebox
import pandas as pd
import os
from pathlib import Path  # Melhor para manipular caminhos de arquivo
from collections import defaultdict
import threading

class OilWellOrganizer:
    # ... (O método __init__ e setup_ui permanecem os mesmos) ...

    # --- NOVO MÉTODO AUXILIAR ---
    def _clean_filename(self, name):
        """Limpa o nome de um campo/poço para usá-lo como nome de pasta/arquivo."""
        if pd.isna(name):
            return "SEM_NOME"
        name = str(name).strip()
        # Remove caracteres que podem ser problemáticos em nomes de arquivos (Windows/Linux)
        name = name.replace(':', '_').replace('/', '_').replace('\\', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_').replace(' ', '_')
        return name[:50] # Limita o comprimento por segurança
    
    # --- MÉTODO REVISADO ---
    def load_and_analyze_files(self):
        self.log_message("Carregando e analisando arquivos...", clear=True)
        self.data_frames = []
        
        # Colunas chave que queremos mapear/manter
        KEY_COLUMNS = {
            'nome poço': 'Nome_Poco',
            'campo': 'Campo',
            'período': 'Periodo_Str',
            'óleo (bbl/dia)': 'Oleo_bbl_dia',
            'gás natural (mm³/dia)': 'Gas_Mm3_dia',
            'água (bbl/dia)': 'Agua_bbl_dia'
        }

        try:
            for i, file in enumerate(self.csv_files, 1):
                self.log_message(f"Lendo arquivo {i}/{len(self.csv_files)}: {os.path.basename(file)}")
                
                # 1. Leitura robusta (Vírgula como decimal e Ponto e Vírgula como separador)
                # dtype='str' evita que o Pandas tente adivinhar tipos antes do tratamento
                df = pd.read_csv(file, sep=';', skiprows=4, decimal=',', encoding='latin-1', dtype=str)
                
                # 2. Padronizar Colunas
                # Remove espaços, transforma para minúsculo para a checagem
                df.columns = df.columns.str.strip().str.lower()
                
                # Mapear e Renomear colunas
                rename_map = {}
                for col_csv, col_padrao in KEY_COLUMNS.items():
                    # Trata o caso em que o nome do CSV tem algum caracter extra
                    matched_col = next((col for col in df.columns if col_csv in col), None)
                    if matched_col:
                        rename_map[matched_col] = col_padrao

                df = df.rename(columns=rename_map)
                
                # 3. Conversão de Tipos e Tratamento de Data
                if 'Periodo_Str' in df.columns:
                    # Converte a coluna de período para datetime (crucial para ordenação correta)
                    df['Período'] = pd.to_datetime(df['Periodo_Str'], format='%Y/%m', errors='coerce')
                    # df = df.drop(columns=['Periodo_Str']) # Opcional: remover a coluna de string
                
                # Forçar conversão dos dados de produção para numérico (float)
                for col in ['Oleo_bbl_dia', 'Gas_Mm3_dia', 'Agua_bbl_dia']:
                    if col in df.columns:
                        # O 'decimal=',' já converteu a vírgula para ponto. Agora transformamos em float
                        df[col] = pd.to_numeric(df[col], errors='coerce') 

                # Selecionar apenas as colunas de interesse (reduz a memória e unifica a estrutura)
                cols_to_keep = list(KEY_COLUMNS.values()) + ['Período']
                df_filtered = df.reindex(columns=cols_to_keep)
                
                self.data_frames.append(df_filtered)
                self.log_message(f"✓ Arquivo {i} carregado e padronizado: {len(df_filtered)} registros")
            
            # Análise dos dados
            self.analyze_data()
            
        except Exception as e:
            self.log_message(f"❌ Erro ao carregar arquivos: {str(e)}")
            messagebox.showerror("Erro", f"Erro ao carregar arquivos:\n{str(e)}")

    # --- MÉTODO REVISADO ---
    def analyze_data(self):
        if not self.data_frames:
            return
        
        all_data = pd.concat(self.data_frames, ignore_index=True)
        
        # Análise usando os nomes de coluna padronizados
        total_registros = len(all_data)
        pocos_unicos = all_data['Nome_Poco'].nunique() if 'Nome_Poco' in all_data.columns else 0
        campos_unicos = all_data['Campo'].nunique() if 'Campo' in all_data.columns else 0
        
        if 'Campo' in all_data.columns:
            campos = sorted(all_data['Campo'].dropna().unique())
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
            periodo_str = "N/A (Erro no Período)"
        
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


    # --- MÉTODO REVISADO ---
    # --- MÉTODO CORRIGIDO ---
    def process_files(self):
        try:
            self.log_message("="*50, clear=True)
            self.log_message("🚀 INICIANDO PROCESSAMENTO...")
            self.log_message("="*50)
            
            self.log_message("Combinando todos os arquivos...")
            all_data = pd.concat(self.data_frames, ignore_index=True)
            
            self.log_message("Agrupando dados por Campo...")
            
            # Garante que a coluna Campo exista e trata valores vazios
            if 'Campo' not in all_data.columns:
                 raise KeyError("Coluna 'Campo' não encontrada após unificação dos dados.")
                 
            # 4. Agrupamento estratégico: agrupa primeiro por campo
            grouped_by_field = all_data.groupby('Campo', dropna=False) # dropna=False garante que campos 'NaN' sejam processados
            
            total_campos = len(grouped_by_field)
            self.log_message(f"Total de campos a processar: {total_campos}")
            
            processed_count = 0
            
            # 5. Processar cada Campo
            for idx_c, (campo_nome, campo_data) in enumerate(grouped_by_field, 1):
                # Usa a nova função auxiliar e Pathlib para segurança do caminho
                campo_dir_name = self._clean_filename(campo_nome)
                campo_dir_path = Path(self.output_dir) / campo_dir_name
                campo_dir_path.mkdir(parents=True, exist_ok=True) # Cria a pasta
                
                # Agrupar por POÇO dentro do campo
                grouped_by_well = campo_data.groupby('Nome_Poco')
                
                # Processar cada poço dentro do campo
                for poco_nome, poco_data in grouped_by_well:
                    
                    poco_nome_clean = self._clean_filename(poco_nome)
                    
                    # Ordenar por Período (que agora é Datetime)
                    if 'Período' in poco_data.columns:
                        poco_data = poco_data.sort_values('Período')
                        
                        # <<< CORREÇÃO DA LINHA 206: REMOVENDO A COLUNA DATETIME >>>
                        # Remove a coluna Datetime após usá-la para ordenação.
                        # Isso garante que a coluna Periodo_Str (a string original) seja usada no CSV,
                        # evitando o erro de formatação na escrita.
                        poco_data = poco_data.drop(columns=['Período']) 
                        
                    # Salvar arquivo do poço
                    output_file = campo_dir_path / f"{poco_nome_clean}.csv"
                    # Salva usando os mesmos delimitadores de entrada
                    poco_data.to_csv(output_file, index=False, sep=';', decimal=',', encoding='latin-1')
                    
                    processed_count += 1
                
                # Log de progresso
                if idx_c % 1 == 0 or idx_c == total_campos:
                    self.log_message(f"Processando Campos: {idx_c}/{total_campos}. Poços salvos até agora: {processed_count}")

            self.log_message("="*50)
            self.log_message("✅ PROCESSAMENTO CONCLUÍDO COM SUCESSO!")
            self.log_message("="*50)
            self.log_message(f"Total de poços processados: {processed_count}")
            self.log_message(f"Arquivos salvos em: {self.output_dir}")
            
            self.root.after(0, lambda: messagebox.showinfo(
                "Sucesso!", 
                f"Processamento concluído!\n\n"
                f"Total de poços: {processed_count}\n"
                f"Arquivos salvos em:\n{self.output_dir}"
            ))

        except Exception as e:
            self.log_message(f"❌ ERRO: {str(e)}")
            self.root.after(0, lambda: messagebox.showerror("Erro", f"Erro durante processamento:\n{str(e)}"))
        
        finally:
            self.root.after(0, self.finish_processing)