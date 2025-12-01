'use client'

import { SiAlipay, SiWechat } from '@icons-pack/react-simple-icons'
import { CoffeeIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '~/components/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/base/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/base/tabs'
import { cn } from '~/utils/cn'

interface DonateProps {
  className?: string
}

export function Donate({ className }: DonateProps) {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn('gap-2', className)}>
          <CoffeeIcon className="size-4" />
          <span>打赏</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>打赏支持</DialogTitle>
          <DialogDescription>
            如果您觉得我的文章对您有帮助，欢迎请我喝杯咖啡 ☕️
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="wechat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wechat" className="gap-2">
              <SiWechat className="size-4 text-[#07C160]" />
              微信
            </TabsTrigger>
            <TabsTrigger value="alipay" className="gap-2">
              <SiAlipay className="size-4 text-[#1677FF]" />
              支付宝
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wechat" className="mt-4 flex flex-col items-center gap-4">
            <div className="bg-muted flex aspect-square w-64 items-center justify-center overflow-hidden rounded-lg border">
              <div className="text-muted-foreground flex flex-col items-center gap-2">
                <Image width={256} height={256} src="/images/wechat-pay.png" alt="WeChat Pay" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm">打开微信扫一扫</p>
          </TabsContent>
          <TabsContent value="alipay" className="mt-4 flex flex-col items-center gap-4">
            <div className="bg-muted flex aspect-square w-64 items-center justify-center overflow-hidden rounded-lg border">
              <div className="text-muted-foreground flex flex-col items-center gap-2">
                <Image src="/images/alipay.png" alt="Alipay" width={256} height={256} />
              </div>
            </div>
            <p className="text-muted-foreground text-sm">打开支付宝扫一扫</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
