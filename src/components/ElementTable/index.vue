<template>
   <div class="component-ElementTable" style="width:100%;height:100%">
 
        <el-row class="page-table" >
            
            <el-table 

                    :data="!list_table.client?
                        list_table.data:
                        list_table.data.slice((list_table.pagination.pageIndex-1)*list_table.pagination.pageRowSize,
                        list_table.pagination.pageIndex*list_table.pagination.pageRowSize)
                    "      
                    @selection-change="List_handleSelectionChange" 
                    ref="multipleTable" 
                    height="100%" 
                    :span-method="arraySpanMethod"
                    @sort-change="sortchange"
                    :border="list_table.border"
            >
                    
                    <!-- 序号列 -->
                    
                    <el-table-column  v-if="list_table.hasIndex"  label="#" min-width="60" align="center">
                        <template slot-scope="scope">
                            {{scope.$index+(list_table.pagination.pageIndex - 1) * list_table.pagination.pageRowSize + 1}}
                        </template>
                    </el-table-column>
                    

                    <!-- 选择列 -->

                    <el-table-column  v-if="list_table.hasSelect"  width="60" align="center" type="selection"></el-table-column>


                    <!-- 普通列,钻取列,自定义列 --> 

                    <el-table-column  
                        v-for="(item, index) in list_table.header"
                        :property="item.key" 
                        :label="item.name"  
                        :key="item.key" :align="item.align?item.align:'center'" 
                        :min-width="item.width?item.width:150" 
                        :fixed="item.fixed?item.fixed:false" 
                        v-if="!item.hidden"
                        show-overflow-tooltip 
                        :sortable="item.sort?'custom':false"
                        >
                        <template slot-scope="scope"  >
                            <template v-if="!item.formatter">
                                <template v-if="!item.isDrill">
                                    {{list_table.data[scope.$index][item.key]}}
                                </template>
                                <template  v-else>
                                    <el-button v-if="!item.text" type="text" size="mini" @click="CellClick(item.key,scope.row)">{{list_table.data[scope.$index][item.key]}}</el-button>
                                    <el-button v-else type="text" size="mini" @click="CellClick(item.key,scope.row)">{{item.text}}</el-button>
                                </template>
                            </template>    
                            <template  v-else>
                                <slot  :name="item.key" :scope="scope" :row="scope.row"></slot>
                            </template>
                        </template>

                    </el-table-column>


                    


            </el-table>


        </el-row>       
        <el-row class="page-function">
            <el-pagination
                background
                v-if="!(list_table.pagination.show == false)"
                :style="{float:list_table.pagination.position=='right'?'right':'left'}"
                @size-change="List_handleSizeChange"
                @current-change="List_handleCurrentChange"
                :current-page="list_table.pagination.pageIndex"
                :page-sizes="[5, 10, 20, 30, 50, 100, 200]"
                :pager-count=5
                :page-size="list_table.pagination.pageRowSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="list_table.pagination.total">
            </el-pagination> 
            <div class="function-button">
            
            <el-button v-for="item in list_table.button" :key="item.id" type="primary" size="mini" @click="ButtonFunc(item.id,item.export)">{{item.name}}</el-button>

            </div>
        </el-row>



    </div>
</template>





<script>


export default {
 
    data(){
         
        let data = {


            list_table:{
                   
                   cellSpan:false,
                   client:false,
                   hasIndex:false,
                   hasSelect:false,
                   border:false,
                   header:[
                    //    {
                    //         name:"",        表头显示值
                    //         key:"",          
                    //         isDrill:false,  是否钻取
                    //         width:150,      宽度
                    //         text:false,     钻取显示文本
                    //         fixed:false,    左右对其
                    //         hidden:false    是否隐藏    
                    //         sort:false      是否排序    
                    //         exporthidden:false    导出隐藏        
                    //    }
                   ],
                   data:[],
                   pagination:{
                      
                      pageIndex:1,
                      pageRowSize:10,
                      total:0
                   },
                   button:[
                       
                    //  {
                    //    id:"",
                    //    name:"",
                    //    export:false,
                    //    option:{
                    //        url:"",
                    //        params:{},
                    //        fileName:""
                    //    }
                    //   }
                   ],
                   selectOption:"",
            }, 

        }
        
        return data;
    },
    model:{

        prop:"value",
        event:"ModelValue"

    },
    props:{
        options:{

            default:() => ({

                hasIndex:false,
                hasSelect:false,
                header:[],
                data:[],
                pagination:{
                    
                    pageIndex:1,
                    pageRowSize:10,
                    total:0
                },
                button:[],
                selectOption:"",
            })

        },
        value:""

    },
    methods:{
    
        List_handleSelectionChange(val){
            
            this.list_table.selectOption = val;
            this.HandleFunc("handleSelectionChange",val);

        },
        List_handleSizeChange(val){
            
            this.list_table.pagination.pageRowSize = val; 
            this.HandleFunc("handleSizeChange",val); 

        },  
        List_handleCurrentChange(val){

            this.list_table.pagination.pageIndex = val;
            this.HandleFunc("handleCurrentChange",val);

        },
        ListExportAllData(){


        },
        HandleFunc(type,val){
            
            this.ModelValue(); 
            this.$emit("handle-func",type,val)
            
        },
        CellClick(type,val){
            
            this.ModelValue();
            this.$emit("cell-click",type,val)

        },
        ButtonFunc(id,isexport = false){

            this.ModelValue();
            this.$emit("button-func",id,isexport)

            if(isexport){
            
                let ExportOption = this.list_table.button.filter(params=>params.export&&params.id==id);
                let exp_columnnamesanddisplaynames  = this.list_table.header.filter(params => !params.hidden&&!params.exporthidden).map(params=>`${params.key}&${params.name}`).join(",");
                
                ComApi.exportAllData(ExportOption[0].option.url,ExportOption[0].option.params,ExportOption[0].option.fileName,exp_columnnamesanddisplaynames)
                
            }

        },
        doLayout(){

            this.$refs["multipleTable"].doLayout();
        },
        ModelValue(){

            this.$emit("ModelValue",this.list_table);  

        },
        sortchange({ column, prop, order }){

            let sort = order=="ascending"?"asc":"desc"
            let colname = prop;
            
            this.$emit("cell-click","sortChange",{colname,sort})

        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }){  /////合并单元格
                
            if(!this.list_table.cellspan)  return "";
            ///////////
            else{

                let total = this.list_table.data.length;
                
                let row_total =  new Set(this.list_table.data.map(param => param.ROWNUM))

                let row_index = [];
                
                row_total.forEach(elem=>{

                    row_index.push({"number":this.list_table.data.filter(param => param.ROWNUM ==elem ).length})
                })
                
                
                let row_total_index = 0;               
                ///row_index [10, 3, 11, 13]
                row_index = row_index.map(param =>{ 
                
        

                    param.index = row_total_index; 
                    row_total_index += param.number ; 
                
                    return param
                
                })

            

                if (columnIndex <  6) {
                if ( row_index.filter(param => param.index == rowIndex).length>0 ) {  //0,10,13,24  //10,13,24,37
                    
                    return {
                    rowspan: row_index.filter(param => param.index == rowIndex)[0].number*1,
                    colspan: 1
                    };
                } else {
                    return {
                    rowspan: 0,
                    colspan: 0
                    };
                }
                }
                }
                
                
                ////////
        }

    },
    mounted(){

        this.list_table = this.options
    },
    watch:{

        options:{
　　　　　　　　
　　　　　　handler(val,oldVal){
            
             this.list_table = this.options

             this.$refs["multipleTable"].doLayout();
             　　　　　　　　
           },
　　　　　　deep:true

　　    }

    }

}
</script>


<style  lang="less"  scoped>

    .component-ElementTable{ 

        .page-table{

            height: calc(100% - 60px);

        }
        .page-function{

            height: 50px;
            margin-top:10px;
            padding: 10px 0px;

            .function-button{
    
                float: right;
            
            }
        }

        .el-table{

            height:100% !important;
        }
    }
    
</style>
