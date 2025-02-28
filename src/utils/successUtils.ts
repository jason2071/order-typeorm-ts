import { FastifyReply } from 'fastify'

interface Response<T> {
  status: number
  message: string
  data: T
}

// ฟังก์ชันสำหรับสร้างการตอบกลับแบบกำหนดเอง
export function customSuccess<T>(reply: FastifyReply, message: string, data: T) {
  const response: Response<T> = {
    status: 200,
    message,
    data,
  }

  // ล็อกข้อมูลการตอบกลับ
  // const payloadLog = JSON.stringify(response);
  // WritLogEnd(logger, req, "info", message, payloadLog, 200); // คุณต้องแทนที่ WritLogEnd ด้วยฟังก์ชันล็อกของคุณเอง

  // ส่งข้อมูลการตอบกลับ
  reply.code(200).send(response)
}
