import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { FileText, Download } from 'lucide-react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    nomeCredor: '',
    cpfCredor: '',
    nascimentoCredor: '',
    nomeDevedor: '',
    cpfDevedor: '',
    nascimentoDevedor: '',
    rua: '',
    cidade: '',
    estado: '',
    valor: '',
    servicoPrestado: ''
  })

  const [isGenerating, setIsGenerating] = useState(false)

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatCurrency = (value) => {
    const numbers = value.replace(/\D/g, '')
    const amount = parseFloat(numbers) / 100
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const handleCPFChange = (field, value) => {
    const formatted = formatCPF(value)
    if (formatted.length <= 14) {
      handleInputChange(field, formatted)
    }
  }

  const handleCurrencyChange = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      const formatted = formatCurrency(numbers)
      handleInputChange('valor', formatted)
    }
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'recibo-fiscal.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Erro ao gerar PDF. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto text-[18px]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <FileText className="h-12 w-12 text-blue-700 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gerador de Recibos</h1>
          </div>
          <p className="text-gray-700">Preencha os dados com calma. Leva menos de 2 minutos.</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-center text-blue-800">Dados do Recibo</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Todos os campos são obrigatórios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* Seção Credor */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm">1</span>
                Dados do Credor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCredor" className="text-gray-900">Nome completo do credor</Label>
                  <Input
                    id="nomeCredor"
                    value={formData.nomeCredor}
                    onChange={(e) => handleInputChange('nomeCredor', e.target.value)}
                    placeholder="Ex.: Maria da Silva"
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500">Informe o nome igual ao documento.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfCredor" className="text-gray-900">CPF do credor</Label>
                  <Input
                    id="cpfCredor"
                    value={formData.cpfCredor}
                    onChange={(e) => handleCPFChange('cpfCredor', e.target.value)}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nascimentoCredor" className="text-gray-900">Data de nascimento do credor</Label>
                  <Input
                    id="nascimentoCredor"
                    type="date"
                    value={formData.nascimentoCredor}
                    onChange={(e) => handleInputChange('nascimentoCredor', e.target.value)}
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção Devedor */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm">2</span>
                Dados do Devedor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeDevedor" className="text-gray-900">Nome completo do devedor</Label>
                  <Input
                    id="nomeDevedor"
                    value={formData.nomeDevedor}
                    onChange={(e) => handleInputChange('nomeDevedor', e.target.value)}
                    placeholder="Ex.: João Pereira"
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfDevedor" className="text-gray-900">CPF do devedor</Label>
                  <Input
                    id="cpfDevedor"
                    value={formData.cpfDevedor}
                    onChange={(e) => handleCPFChange('cpfDevedor', e.target.value)}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nascimentoDevedor" className="text-gray-900">Data de nascimento do devedor</Label>
                  <Input
                    id="nascimentoDevedor"
                    type="date"
                    value={formData.nascimentoDevedor}
                    onChange={(e) => handleInputChange('nascimentoDevedor', e.target.value)}
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção Localização */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm">3</span>
                Informações do Serviço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rua" className="text-gray-900">Endereço/Rua</Label>
                  <Input
                    id="rua"
                    value={formData.rua}
                    onChange={(e) => handleInputChange('rua', e.target.value)}
                    placeholder="Ex.: Rua Exemplo, 123 - Centro"
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade" className="text-gray-900">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    placeholder="Ex.: São Paulo"
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-gray-900">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                    <SelectTrigger className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Seção Valor e Serviço */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm">4</span>
                Detalhes Financeiros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-gray-900">Valor do serviço</Label>
                  <Input
                    id="valor"
                    value={formData.valor}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    placeholder="R$ 0,00"
                    inputMode="numeric"
                    className="h-12 text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="servicoPrestado" className="text-gray-900">Descrição do serviço prestado</Label>
                  <Textarea
                    id="servicoPrestado"
                    value={formData.servicoPrestado}
                    onChange={(e) => handleInputChange('servicoPrestado', e.target.value)}
                    placeholder="Descreva detalhadamente o serviço prestado"
                    rows={4}
                    className="text-[18px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500">Ex.: Instalação elétrica residencial realizada em 12/03/2025.</p>
                </div>
              </div>
            </div>

            {/* Botão Gerar PDF */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={generatePDF}
                disabled={!isFormValid() || isGenerating}
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="mr-2 h-5 w-5" />
                {isGenerating ? 'Gerando PDF...' : 'Gerar Recibo PDF'}
              </Button>
              <p className="text-sm text-gray-500 mt-2 text-center">Você poderá baixar o PDF em seguida.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

