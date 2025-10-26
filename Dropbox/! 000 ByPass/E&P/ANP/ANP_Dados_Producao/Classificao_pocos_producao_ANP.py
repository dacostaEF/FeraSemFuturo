import tkinter as tk
from tkinter import ttk, filedialog, scrolledtext, messagebox
import pandas as pd
import os
from pathlib import Path
from collections import defaultdict
import threading

class OilWellOrganizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Organizador de Poços - Produção ANP")
        self.root.geometry("900x700")
        
        self.csv_files = []
        self.output_dir = ""
        self.data_frames = []
        
        self.setup_ui()
    
    def setup_ui(self):
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Título
        title = ttk.Label(main_frame, text="🛢️ Organizador de Poços - Produção ANP", 
                         font=('Arial', 16, 'bold'))
        title.grid(row=0, column=0, columnspan=3, pady=10)
        
        # Botões de ação
        btn_frame = ttk.Frame(main_frame)
        btn_frame.grid(row=1, column=0, columnspan=3, pady=10)
        
        self.btn_select = ttk.Button(btn_frame, text="📂 Selecionar Arquivos CSV", 
                                     command=self.select_files)
        self.btn_select.pack(side=tk.LEFT, padx=5)
        
        self.btn_clear = ttk.Button(btn_frame, text="🗑️ Limpar", 
                                    command=self.clear_files)
        self.btn_clear.pack(side=tk.LEFT, padx=5)
        
        # Lista de arquivos
        ttk.Label(main_frame, text="📁 Arquivos carregados:", 
                 font=('Arial', 10, 'bold')).grid(row=2, column=0, sticky=tk.W, pady=5)
        
        self.file_listbox = tk.Listbox(main_frame, height=6, width=80)
        self.file_listbox.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        
        scrollbar = ttk.Scrollbar(main_frame, orient=tk.VERTICAL, command=self.file_listbox.yview)
        scrollbar.grid(row=3, column=3, sticky=(tk.N, tk.S))
        self.file_listbox.config(yscrollcommand=scrollbar.set)
        
        # Resumo dos dados
        ttk.Label(main_frame, text="📊 Resumo dos Dados:", 
                 font=('Arial', 10, 'bold')).grid(row=4, column=0, sticky=tk.W, pady=10)
        
        self.summary_text = scrolledtext.ScrolledText(main_frame, height=8, width=80, 
                                                      wrap=tk.WORD, state='disabled')
        self.summary_text.grid(row=5, column=0, columnspan=3, pady=5)
        
        # Seleção de pasta destino
        dest_frame = ttk.Frame(main_frame)
        dest_frame.grid(row=6, column=0, columnspan=3, pady=10)
        
        ttk.Label(dest_frame, text="📂 Pasta Destino:").pack(side=tk.LEFT, padx=5)
        
        self.dest_entry = ttk.Entry(dest_frame, width=50)
        self.dest_entry.pack(side=tk.LEFT, padx=5)
        
        ttk.Button(dest_frame, text="Selecionar", 
                  command=self.select_output_dir).pack(side=tk.LEFT, padx=5)
        
        # Botão processar
        self.btn_process = ttk.Button(main_frame, text="🚀 PROCESSAR E ORGANIZAR", 
                                     command=self.start_processing, state='disabled')
        self.btn_process.grid(row=7, column=0, columnspan=3, pady=15)
        
        # Barra de progresso
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate', length=600)
        self.progress.grid(row=8, column=0, columnspan=3, pady=5)
        
        # Log de operações
        ttk.Label(main_frame, text="📝 Log de Operações:", 
                 font=('Arial', 10, 'bold')).grid(row=9, column=0, sticky=tk.W, pady=5)
        
        self.log_text = scrolledtext.ScrolledText(main_frame, height=10, width=80, 
                                                  wrap=tk.WORD, state='disabled')
        self.log_text.grid(row=10, column=0, columnspan=3, pady=5)
        
        # Configurar expansão
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
    
    def select_files(self):
        files = filedialog.askopenfilenames(
            title="Selecionar arquivos CSV",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        
        if files:
            self.csv_files = list(files)
            self.update_file_list()
            self.load_and_analyze_files()
    
    def update_file_list(self):
        self.file_listbox.delete(0, tk.END)
        for file in self.csv_files:
            filename = os.path.basename(file)
            self.file_listbox.insert(tk.END, f"📄 {filename}")
    
    def clear_files(self):
        self.csv_files = []
        self.data_frames = []
        self.file_listbox.delete(0, tk.END)
        self.update_summary("")
        self.log_message("Arquivos limpos.", clear=True)
        self.btn_process.config(state='disabled')
    
    def select_output_dir(self):
        directory = filedialog.askdirectory(title="Selecionar pasta de destino")
        if directory:
            self.output_dir = directory
            self.dest_entry.delete(0, tk.END)
            self.dest_entry.insert(0, directory)
            self.check_ready_to_process()
    
    def load_and_analyze_files(self):
        self.log_message("Carregando e analisando arquivos...", clear=True)
        self.data_frames = []
        
        try:
            for i, file in enumerate(self.csv_files, 1):
                self.log_message(f"Lendo arquivo {i}/{len(self.csv_files)}: {os.path.basename(file)}")
                
                # Ler CSV pulando as primeiras 4 linhas de cabeçalho da ANP
                df = pd.read_csv(file, sep=';', skiprows=4, decimal=',', encoding='latin-1')
                
                # Limpar nome das colunas
                df.columns = df.columns.str.strip()
                
                self.data_frames.append(df)
                self.log_message(f"✓ Arquivo {i} carregado: {len(df)} registros")
            
            # Análise dos dados
            self.analyze_data()
            
        except Exception as e:
            self.log_message(f"❌ Erro ao carregar arquivos: {str(e)}")
            messagebox.showerror("Erro", f"Erro ao carregar arquivos:\n{str(e)}")
    
    def analyze_data(self):
        if not self.data_frames:
            return
        
        # Combinar todos os dataframes
        all_data = pd.concat(self.data_frames, ignore_index=True)
        
        # Análise
        total_registros = len(all_data)
        pocos_unicos = all_data['Nome Poço'].nunique() if 'Nome Poço' in all_data.columns else 0
        campos_unicos = all_data['Campo'].nunique() if 'Campo' in all_data.columns else 0
        
        # Lista de campos
        if 'Campo' in all_data.columns:
            campos = sorted(all_data['Campo'].unique())
            campos_str = ", ".join(campos[:10])
            if len(campos) > 10:
                campos_str += f" ... (+{len(campos)-10} campos)"
        else:
            campos_str = "N/A"
        
        # Períodos
        if 'Período' in all_data.columns:
            periodos = all_data['Período'].unique()
            periodo_min = min(periodos)
            periodo_max = max(periodos)
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
    
    def update_summary(self, text):
        self.summary_text.config(state='normal')
        self.summary_text.delete(1.0, tk.END)
        self.summary_text.insert(1.0, text)
        self.summary_text.config(state='disabled')
    
    def log_message(self, message, clear=False):
        self.log_text.config(state='normal')
        if clear:
            self.log_text.delete(1.0, tk.END)
        self.log_text.insert(tk.END, f"{message}\n")
        self.log_text.see(tk.END)
        self.log_text.config(state='disabled')
    
    def check_ready_to_process(self):
        if self.data_frames and self.output_dir:
            self.btn_process.config(state='normal')
    
    def start_processing(self):
        if not self.output_dir:
            messagebox.showwarning("Atenção", "Selecione uma pasta de destino!")
            return
        
        # Desabilitar botões durante processamento
        self.btn_process.config(state='disabled')
        self.btn_select.config(state='disabled')
        self.progress.start(10)
        
        # Executar processamento em thread separada
        thread = threading.Thread(target=self.process_files)
        thread.start()
    
    def process_files(self):
        try:
            self.log_message("="*50, clear=True)
            self.log_message("🚀 INICIANDO PROCESSAMENTO...")
            self.log_message("="*50)
            
            # Combinar todos os dataframes
            self.log_message("Combinando todos os arquivos...")
            all_data = pd.concat(self.data_frames, ignore_index=True)
            
            # Agrupar por poço
            self.log_message("Agrupando dados por poço...")
            grouped = all_data.groupby('Nome Poço')
            
            total_pocos = len(grouped)
            self.log_message(f"Total de poços a processar: {total_pocos}")
            
            # Processar cada poço
            for idx, (poco_nome, poco_data) in enumerate(grouped, 1):
                # Limpar nome do poço para usar como nome de arquivo
                poco_nome_clean = poco_nome.strip().replace(' ', '_')
                
                # Obter campo do poço
                campo = poco_data['Campo'].iloc[0] if 'Campo' in poco_data.columns else 'SEM_CAMPO'
                campo = str(campo).strip()
                
                # Criar pasta do campo
                campo_dir = os.path.join(self.output_dir, campo)
                os.makedirs(campo_dir, exist_ok=True)
                
                # Ordenar por período
                if 'Período' in poco_data.columns:
                    poco_data = poco_data.sort_values('Período')
                
                # Salvar arquivo do poço
                output_file = os.path.join(campo_dir, f"{poco_nome_clean}.csv")
                poco_data.to_csv(output_file, index=False, sep=';', decimal=',', encoding='latin-1')
                
                if idx % 10 == 0 or idx == total_pocos:
                    self.log_message(f"Processados {idx}/{total_pocos} poços ({idx*100//total_pocos}%)")
            
            self.log_message("="*50)
            self.log_message("✅ PROCESSAMENTO CONCLUÍDO COM SUCESSO!")
            self.log_message("="*50)
            self.log_message(f"Arquivos salvos em: {self.output_dir}")
            
            # Mostrar mensagem de sucesso
            self.root.after(0, lambda: messagebox.showinfo(
                "Sucesso!", 
                f"Processamento concluído!\n\n"
                f"Total de poços: {total_pocos}\n"
                f"Arquivos salvos em:\n{self.output_dir}"
            ))
            
        except Exception as e:
            self.log_message(f"❌ ERRO: {str(e)}")
            self.root.after(0, lambda: messagebox.showerror("Erro", f"Erro durante processamento:\n{str(e)}"))
        
        finally:
            # Reabilitar botões
            self.root.after(0, self.finish_processing)
    
    def finish_processing(self):
        self.progress.stop()
        self.btn_process.config(state='normal')
        self.btn_select.config(state='normal')

def main():
    root = tk.Tk()
    app = OilWellOrganizer(root)
    root.mainloop()

if __name__ == "__main__":
    main()