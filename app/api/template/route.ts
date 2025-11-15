import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { verifyAdmin } from '@/lib/auth'

// GET template
export async function GET() {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDb()
    const template = await db.collection('invitationTemplate').findOne({ key: 'invitationTemplate' })

    if (!template) {
      // Return default template if not found
//       const defaultTemplate = `💗យេីងខ្ញុំ សូមគោរពអញ្ជើញ​ {{GUEST_NAME}}!   ចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីមង្គលការយេីងខ្ញុំ ដែលប្រារព្ធទៅនាថ្ងៃ​ថ្ងៃសៅរ៍ ទី១៧ ខែមករា ឆ្នាំ២០២៦ វេលាម៉ោង​ ០៥:០០នាទីល្ងាច នៅដឹ ព្រេមៀ សេនធ័រសែនសុខ អគារ B ដោយមេត្រីភាព🙏 

// យេីងខ្ញុំសូមការយោគយល់អធ្យាស្រ័យ🙏ប្រសិនបេីយេីងខ្ញុំមិនបានជូនធៀបអញ្ចេីញដោយផ្ទាល់ដៃ៕ 

//       អាស្រ័យ​ដូចបានជំរាបខាងលេីសូមមេត្តាអញ្ចេីញចូលរួមដោយសេចក្តីគោរព៕​ វត្តមានរបស់លោកអ្នក​ គឺពិតជាផ្តល់កិត្តយសដ៏ឧត្តុង្គឧត្តមដល់គ្រួសារយេីងខ្ញុំ៕

// 👉សូមមេត្តាចុចលើរូបខាងក្រោមនេះ បន្ទាប់មកចុចលើរូបស្រោមសំបុត្រ💌 ( កុំភ្លេចបើកសម្លេងណា​ 🎻​) នៅពីក្រោមឈ្មោះនោះនឹងបានឃើញពត៌មានលម្អិត និងរូបថតកូនក្រមុំ និងកូនកម្លោះ

// 👉សូមចុចLink : {{INVITATION_URL}}

// សូមអរគុណ! 🙏

// `
    const defaultTemplate = `{{GUEST_NAME}}! {{INVITATION_URL}}`

      return NextResponse.json({
        success: true,
        data: {
          template: defaultTemplate,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        template: template.value,
      },
    })
  } catch (error: any) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// POST/PUT template
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { template } = body

    if (!template || typeof template !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Template is required and must be a string' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    // Upsert the template (update if exists, insert if not)
    await db.collection('invitationTemplate').updateOne(
      { key: 'invitationTemplate' },
      {
        $set: {
          key: 'invitationTemplate',
          value: template,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Template saved successfully',
    })
  } catch (error: any) {
    console.error('Error saving template:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save template' },
      { status: 500 }
    )
  }
}

// PUT is an alias for POST
export async function PUT(request: NextRequest) {
  return POST(request)
}

// DELETE template (resets to default)
export async function DELETE() {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDb()
    
    // Delete the template (will return default on next GET)
    await db.collection('invitationTemplate').deleteOne({ key: 'invitationTemplate' })

    return NextResponse.json({
      success: true,
      message: 'Template reset to default',
    })
  } catch (error: any) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to reset template' },
      { status: 500 }
    )
  }
}

